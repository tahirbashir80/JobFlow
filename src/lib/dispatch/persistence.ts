import { db } from "@/lib/db/prisma";
import { createInAppNotification } from "@/lib/notifications/persistence";

export async function getDispatchBoard(
  businessId: string,
  date: Date,
) {
  const start = new Date(date);
  start.setHours(0,0,0,0);
  const end = new Date(start);
  end.setDate(end.getDate()+1);

  const [jobs, staff] = await Promise.all([
    db.job.findMany({
      where: {
        businessId,
        archivedAt: null,
        scheduledStart: { lt: end },
        scheduledEnd: { gt: start },
        status: { in: ["NEW", "SCHEDULED", "ASSIGNED", "DISPATCHED", "EN_ROUTE", "ON_SITE", "IN_PROGRESS"] },
      },
      orderBy: { scheduledStart: "asc" },
      include: {
        customer: true,
        site: true,
        service: true,
        assignments: {
          where: { isPrimary: true, status: { notIn: ["CANCELLED", "DECLINED"] } },
          include: { staff: true },
          take: 1,
        },
      },
    }),
    db.staff.findMany({
      where: { businessId, archivedAt: null, status: "ACTIVE" },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
      include: { skills: true, assignments: { where: { job: { scheduledStart: { lt: end }, scheduledEnd: { gt: start }, archivedAt: null } }, include: { job: true } } },
    }),
  ]);

  return { jobs, staff };
}

export async function assignJob(
  businessId: string,
  jobId: string,
  staffId: string,
) {
  return db.$transaction(async (tx) => {
    const job = await tx.job.findFirst({
      where: { id: jobId, businessId, archivedAt: null },
    });
    if (!job) throw new Error("Job not found.");
    if (!job.scheduledStart || !job.scheduledEnd) {
      throw new Error("Schedule the job before assigning a technician.");
    }

    const staff = await tx.staff.findFirst({
      where: { id: staffId, businessId, archivedAt: null, status: "ACTIVE" },
      select: { id: true, firstName: true, lastName: true, userId: true },
    });
    if (!staff) throw new Error("Technician not found.");

    const conflict = await tx.job.findFirst({
      where: {
        businessId,
        id: { not: jobId },
        archivedAt: null,
        scheduledStart: { lt: job.scheduledEnd },
        scheduledEnd: { gt: job.scheduledStart },
        assignments: {
          some: { staffId, isPrimary: true, status: { notIn: ["CANCELLED", "DECLINED"] } },
        },
      },
      include: { assignments: { where: { staffId, isPrimary: true }, include: { staff: true }, take: 1 } },
    });
    if (conflict) {
      throw new Error(`Scheduling conflict: ${staff.firstName} ${staff.lastName ?? ""} is already assigned to ${conflict.jobNumber}.`);
    }

    const existing = await tx.jobAssignment.findFirst({
      where: { jobId: job.id, isPrimary: true },
    });

    if (existing) {
      const updated = await tx.jobAssignment.update({
        where: { id: existing.id },
        data: { staffId, status: "ASSIGNED", assignedAt: new Date(), acceptedAt: null, declinedAt: null },
      });
      await tx.job.update({ where: { id: job.id }, data: { status: "ASSIGNED" } });
      if (staff.userId) {
        await createInAppNotification({
          businessId,
          userId: staff.userId,
          subject: `Job ${job.jobNumber} assigned`,
          message: `${job.title || "A job"} has been assigned to you.`,
          metadata: { type: "JOB_ASSIGNED", jobId: job.id, jobNumber: job.jobNumber },
        });
      }
      return updated;
    }

    const created = await tx.jobAssignment.create({
      data: {
        businessId,
        jobId: job.id,
        staffId,
        isPrimary: true,
        status: "ASSIGNED",
      },
    });
    await tx.job.update({ where: { id: job.id }, data: { status: "ASSIGNED" } });
    if (staff.userId) {
      await createInAppNotification({
        businessId,
        userId: staff.userId,
        subject: `Job ${job.jobNumber} assigned`,
        message: `${job.title || "A job"} has been assigned to you.`,
        metadata: { type: "JOB_ASSIGNED", jobId: job.id, jobNumber: job.jobNumber },
      });
    }
    return created;
  });
}

export async function unassignJob(businessId: string, jobId: string) {
  return db.$transaction(async (tx) => {
    const job = await tx.job.findFirst({ where: { id: jobId, businessId, archivedAt: null } });
    if (!job) throw new Error("Job not found.");
    await tx.jobAssignment.updateMany({
      where: { jobId, businessId, isPrimary: true },
      data: { status: "CANCELLED" },
    });
    await tx.job.update({ where: { id: jobId }, data: { status: "SCHEDULED" } });
  });
}


export async function getWeeklyCalendar(businessId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0,0,0,0);
  start.setDate(start.getDate()-start.getDay());
  const end = new Date(start);
  end.setDate(end.getDate()+7);

  return db.job.findMany({
    where: {
      businessId,
      archivedAt: null,
      scheduledStart: { lt: end },
      scheduledEnd: { gt: start },
    },
    orderBy: { scheduledStart: "asc" },
    include: {
      customer: true,
      site: true,
      service: true,
      assignments: {
        where: { isPrimary: true },
        include: { staff: true },
        take: 1,
      },
    },
  });
}
