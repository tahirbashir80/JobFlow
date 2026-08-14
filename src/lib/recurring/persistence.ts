import { db } from "@/lib/db/prisma";
import { RecurrenceType } from "@/generated/prisma/client";
import { createInAppNotification } from "@/lib/notifications/persistence";

function addInterval(date: Date, type: RecurrenceType, interval: number) {
  const d = new Date(date);
  const n = Math.max(1, interval);
  if (type === "DAILY") d.setDate(d.getDate() + n);
  else if (type === "WEEKLY") d.setDate(d.getDate() + 7 * n);
  else if (type === "BIWEEKLY") d.setDate(d.getDate() + 14 * n);
  else if (type === "MONTHLY") d.setMonth(d.getMonth() + n);
  else if (type === "QUARTERLY") d.setMonth(d.getMonth() + 3 * n);
  else if (type === "SEMI_ANNUAL") d.setMonth(d.getMonth() + 6 * n);
  else if (type === "ANNUAL") d.setFullYear(d.getFullYear() + n);
  else d.setDate(d.getDate() + n);
  return d;
}

async function nextJobNumber(tx: any, businessId: string) {
  const count = await tx.job.count({ where: { businessId } });
  const base = `JOB-${String(count + 1).padStart(6, "0")}`;
  let number = base;
  let suffix = 1;
  while (await tx.job.findUnique({ where: { businessId_jobNumber: { businessId, jobNumber: number } } })) {
    number = `${base}-${suffix++}`;
  }
  return number;
}

export async function listRecurringServices(businessId: string) {
  const rows = await db.recurringService.findMany({
    where: { businessId, archivedAt: null },
    select: {
      id: true,
      name: true,
      recurrenceType: true,
      intervalValue: true,
      nextRunAt: true,
      price: true,
      isActive: true,
      customer: {
        select: { id: true, firstName: true, lastName: true, companyName: true },
      },
      service: {
        select: { id: true, name: true },
      },
    },
    orderBy: [{ isActive: "desc" }, { nextRunAt: "asc" }],
  });

  // Never pass Prisma Decimal instances across the Server → Client boundary.
  return rows.map((row) => ({
    ...row,
    nextRunAt: row.nextRunAt.toISOString(),
    price: row.price == null ? null : Number(row.price),
  }));
}

export async function getRecurringFormData(businessId: string) {
  const [customers, services] = await Promise.all([
    db.customer.findMany({
      where: { businessId, archivedAt: null, isActive: true },
      orderBy: [{ companyName: "asc" }, { firstName: "asc" }],
      select: { id: true, firstName: true, lastName: true, companyName: true },
    }),
    db.service.findMany({
      where: { businessId, archivedAt: null, status: "ACTIVE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  return { customers, services };
}

export async function createRecurringService(
  businessId: string,
  input: {
    customerId: string;
    serviceId: string;
    name: string;
    recurrenceType: RecurrenceType;
    intervalValue: number;
    startDate: string;
    endDate?: string;
    price?: number;
    notes?: string;
  },
) {
  const customer = await db.customer.findFirst({ where: { id: input.customerId, businessId, archivedAt: null, isActive: true } });
  const service = await db.service.findFirst({ where: { id: input.serviceId, businessId, archivedAt: null, status: "ACTIVE" } });
  if (!customer || !service) throw new Error("Customer or service does not belong to this business.");

  const start = new Date(input.startDate);
  if (Number.isNaN(start.getTime())) throw new Error("Invalid start date.");
  const end = input.endDate ? new Date(input.endDate) : null;
  if (end && end < start) throw new Error("End date must be on or after the start date.");

  return db.recurringService.create({
    data: {
      businessId,
      customerId: input.customerId,
      serviceId: input.serviceId,
      name: input.name.trim() || `${service.name} — recurring`,
      recurrenceType: input.recurrenceType,
      intervalValue: Math.max(1, Math.floor(input.intervalValue || 1)),
      startDate: start,
      endDate: end,
      nextRunAt: start,
      price: input.price ?? service.basePrice ?? null,
      notes: input.notes?.trim() || null,
    },
  });
}

export async function setRecurringActive(businessId: string, id: string, isActive: boolean) {
  const recurring = await db.recurringService.findFirst({ where: { id, businessId, archivedAt: null } });
  if (!recurring) throw new Error("Recurring service not found.");
  return db.recurringService.update({ where: { id }, data: { isActive } });
}

export async function generateDueRecurringJobs(businessId: string, userId: string, through = new Date()) {
  const due = await db.recurringService.findMany({
    where: {
      businessId,
      archivedAt: null,
      isActive: true,
      nextRunAt: { lte: through },
      OR: [{ endDate: null }, { endDate: { gte: through } }],
    },
    orderBy: { nextRunAt: "asc" },
  });

  let generated = 0;
  const jobs: { id: string; jobNumber: string; recurringServiceId: string }[] = [];

  for (const recurring of due) {
    await db.$transaction(async (tx) => {
      let runAt = new Date(recurring.nextRunAt);
      while (runAt <= through && (!recurring.endDate || runAt <= recurring.endDate)) {
        const number = await nextJobNumber(tx, businessId);
        const site = await tx.site.findFirst({
          where: { businessId, customerId: recurring.customerId, archivedAt: null, isActive: true },
          orderBy: { createdAt: "asc" },
          select: { id: true },
        });
        const service = await tx.service.findUnique({ where: { id: recurring.serviceId }, select: { estimatedMinutes: true, basePrice: true } });
        const minutes = service?.estimatedMinutes ?? 60;
        const end = new Date(runAt.getTime() + minutes * 60000);
        const job = await tx.job.create({
          data: {
            businessId,
            jobNumber: number,
            customerId: recurring.customerId,
            siteId: site?.id ?? null,
            serviceId: recurring.serviceId,
            createdById: userId,
            status: "SCHEDULED",
            title: recurring.name,
            scheduledStart: runAt,
            scheduledEnd: end,
            price: recurring.price ?? service?.basePrice ?? null,
            totalAmount: recurring.price ?? service?.basePrice ?? null,
            customerNotes: recurring.notes,
            metadata: { recurringServiceId: recurring.id, generatedAt: new Date().toISOString() },
          },
        });
        jobs.push({ id: job.id, jobNumber: job.jobNumber, recurringServiceId: recurring.id });
        generated++;
        runAt = addInterval(runAt, recurring.recurrenceType, recurring.intervalValue);
      }

      const next = runAt;
      const deactivate = recurring.endDate ? next > recurring.endDate : false;
      await tx.recurringService.update({
        where: { id: recurring.id },
        data: { nextRunAt: next, ...(deactivate ? { isActive: false } : {}) },
      });
    });
  }

  if (generated > 0) {
    await createInAppNotification({
      businessId,
      userId,
      subject: `${generated} recurring job${generated === 1 ? "" : "s"} generated`,
      message: "Due recurring schedules have generated new Jobs ready for Calendar and Dispatch.",
      metadata: { type: "RECURRING_JOBS_GENERATED", generated, jobs },
    });
  }

  return { generated, jobs };
}
