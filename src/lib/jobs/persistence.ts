import { db } from "@/lib/db/prisma";
import { JobStatus } from "@/generated/prisma/client";
import { jobSchema, type JobInput } from "@/lib/validation/job";

function jobNumber(count: number) {
  return `JOB-${String(count + 1).padStart(6, "0")}`;
}


export function customerName(customer: { firstName: string | null; lastName: string | null; companyName: string | null }) {
  return customer.companyName?.trim()
    || [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim()
    || "Unnamed customer";
}

export async function listJobs(businessId: string, filters?: { q?: string; status?: string }) {
  const q = filters?.q?.trim();
  const status = filters?.status;

  return db.job.findMany({
    where: {
      businessId,
      archivedAt: null,
      ...(status && status !== "ALL" ? { status: status as JobStatus } : {}),
      ...(q ? {
        OR: [
          { jobNumber: { contains: q, mode: "insensitive" } },
          { title: { contains: q, mode: "insensitive" } },
          { customer: { companyName: { contains: q, mode: "insensitive" } } },
          { customer: { firstName: { contains: q, mode: "insensitive" } } },
          { customer: { lastName: { contains: q, mode: "insensitive" } } },
        ],
      } : {}),
    },
    include: {
      customer: { select: { id: true, firstName: true, lastName: true, companyName: true } },
      site: { select: { id: true, name: true, city: true, state: true } },
      service: { select: { id: true, name: true } },
      assignments: {
        where: { isPrimary: true },
        include: { staff: { select: { id: true, firstName: true, lastName: true } } },
        take: 1,
      },
    },
    orderBy: [{ scheduledStart: "asc" }, { createdAt: "desc" }],
  });
}

export async function getJob(businessId: string, jobId: string) {
  return db.job.findFirst({
    where: { id: jobId, businessId, archivedAt: null },
    include: {
      customer: true,
      site: true,
      service: true,
      contract: { select: { id: true, contractNumber: true, title: true, status: true, billingCycle: true, endDate: true } },
      assignments: {
        include: { staff: true },
        orderBy: { isPrimary: "desc" },
      },
      statusHistory: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
}

export async function getJobFormData(businessId: string) {
  const [customers, services, staff, contracts] = await Promise.all([
    db.customer.findMany({
      where: { businessId, archivedAt: null, isActive: true },
      include: { sites: { where: { archivedAt: null, isActive: true }, orderBy: { name: "asc" } } },
      orderBy: [{ companyName: "asc" }, { firstName: "asc" }, { lastName: "asc" }],
    }),
    db.service.findMany({
      where: { businessId, archivedAt: null, status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
    db.staff.findMany({
      where: { businessId, archivedAt: null, status: "ACTIVE" },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    }),
    db.contract.findMany({
      where: {
        businessId,
        archivedAt: null,
        status: "ACTIVE",
        startDate: { lte: new Date() },
        OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
      },
      select: {
        id: true,
        contractNumber: true,
        title: true,
        customerId: true,
        siteId: true,
        serviceId: true,
        billingCycle: true,
        endDate: true,
      },
      orderBy: [{ contractNumber: "asc" }],
    }),
  ]);

  return { customers, services, staff, contracts };
}

export async function createJob(businessId: string, userId: string, input: JobInput) {
  const data = jobSchema.parse(input);
  const start = new Date(data.scheduledStart);
  const end = new Date(data.scheduledEnd);

  return db.$transaction(async (tx) => {
    const customer = await tx.customer.findFirst({
      where: { id: data.customerId, businessId, archivedAt: null, isActive: true },
      select: { id: true },
    });
    if (!customer) throw new Error("Customer not found for this business.");

    let siteId: string | null = data.siteId?.trim() || null;
    if (siteId) {
      const site = await tx.site.findFirst({
        where: { id: siteId, businessId, customerId: data.customerId, archivedAt: null, isActive: true },
        select: { id: true },
      });
      if (!site) throw new Error("Selected site does not belong to this customer.");
    }

    const service = await tx.service.findFirst({
      where: { id: data.serviceId, businessId, archivedAt: null, status: "ACTIVE" },
      select: { id: true, basePrice: true, estimatedMinutes: true, requiredStaffCount: true },
    });
    if (!service) throw new Error("Service not found for this business.");

    let contractId: string | null = data.contractId?.trim() || null;
    if (contractId) {
      const contract = await tx.contract.findFirst({
        where: {
          id: contractId,
          businessId,
          customerId: data.customerId,
          archivedAt: null,
          status: "ACTIVE",
          startDate: { lte: start },
          OR: [{ endDate: null }, { endDate: { gte: start } }],
          AND: [
            { OR: [{ siteId: null }, ...(siteId ? [{ siteId } as const] : [])] },
            { OR: [{ serviceId: null }, { serviceId: data.serviceId }] },
          ],
        },
        select: { id: true },
      });
      if (!contract) throw new Error("Selected contract is not active or does not apply to this customer, site, or service.");
    }

    let staffId: string | null = data.staffId?.trim() || null;
    if (staffId) {
      const staff = await tx.staff.findFirst({
        where: { id: staffId, businessId, archivedAt: null, status: "ACTIVE" },
        select: { id: true },
      });
      if (!staff) throw new Error("Assigned staff member is not active in this business.");
    }

    const count = await tx.job.count({ where: { businessId } });
    let number = jobNumber(count);
    let suffix = 1;
    while (await tx.job.findUnique({ where: { businessId_jobNumber: { businessId, jobNumber: number } } })) {
      number = `${jobNumber(count)}-${suffix++}`;
    }

    const price = data.price !== undefined
      ? data.price.toFixed(2)
      : service.basePrice?.toString() ?? null;

    const job = await tx.job.create({
      data: {
        businessId,
        jobNumber: number,
        customerId: data.customerId,
        siteId,
        serviceId: data.serviceId,
        contractId,
        createdById: userId,
        status: staffId ? "ASSIGNED" : "SCHEDULED",
        priority: data.priority,
        title: data.title || null,
        description: data.description || null,
        scheduledStart: start,
        scheduledEnd: end,
        price,
        totalAmount: price,
        customerNotes: data.customerNotes || null,
        internalNotes: data.internalNotes || null,
      },
    });

    await tx.jobStatusHistory.create({
      data: {
        jobId: job.id,
        toStatus: job.status,
        changedById: userId,
        reason: "Job created.",
      },
    });

    if (staffId) {
      await tx.jobAssignment.create({
        data: {
          businessId,
          jobId: job.id,
          staffId,
          isPrimary: true,
          status: "ASSIGNED",
        },
      });
    }

    return job;
  });
}

export type OperationalJobStatus =
  | "DRAFT" | "NEW" | "SCHEDULED" | "ASSIGNED" | "DISPATCHED"
  | "EN_ROUTE" | "ON_SITE" | "IN_PROGRESS" | "PAUSED"
  | "COMPLETED" | "CANCELLED" | "RESCHEDULED" | "FAILED" | "INCOMPLETE";

const statusValues: OperationalJobStatus[] = [
  "DRAFT","NEW","SCHEDULED","ASSIGNED","DISPATCHED","EN_ROUTE","ON_SITE",
  "IN_PROGRESS","PAUSED","COMPLETED","CANCELLED","RESCHEDULED","FAILED","INCOMPLETE",
];

export async function updateJobStatus(
  businessId: string,
  userId: string,
  jobId: string,
  status: OperationalJobStatus,
) {
  if (!statusValues.includes(status)) throw new Error("Invalid job status.");

  return db.$transaction(async (tx) => {
    const job = await tx.job.findFirst({
      where: { id: jobId, businessId, archivedAt: null },
      include: { assignments: { where: { isPrimary: true }, take: 1 } },
    });
    if (!job) throw new Error("Job not found.");

    const now = new Date();
    const updated = await tx.job.update({
      where: { id: job.id },
      data: {
        status: status as JobStatus,
        actualStart: (status === "IN_PROGRESS" || status === "ON_SITE") && !job.actualStart ? now : job.actualStart,
        actualEnd: status === "COMPLETED" && !job.actualEnd ? now : job.actualEnd,
      },
    });

    const assignment = job.assignments[0];
    if (assignment) {
      await tx.jobAssignment.update({
        where: { id: assignment.id },
        data: {
          status: status === "COMPLETED" ? "COMPLETED" : assignment.status,
          acceptedAt: (status === "EN_ROUTE" || status === "ON_SITE" || status === "IN_PROGRESS") && !assignment.acceptedAt ? now : assignment.acceptedAt,
          startedAt: (status === "IN_PROGRESS" || status === "ON_SITE") && !assignment.startedAt ? now : assignment.startedAt,
          completedAt: status === "COMPLETED" ? now : assignment.completedAt,
        },
      });
    }

    await tx.jobStatusHistory.create({
      data: {
        jobId: job.id,
        fromStatus: job.status,
        toStatus: status as JobStatus,
        changedById: userId,
        reason: `Status changed to ${status.replaceAll("_", " ").toLowerCase()}.`,
      },
    });

    return updated;
  });
}

export async function startJob(businessId: string, userId: string, jobId: string) {
  return updateJobStatus(businessId, userId, jobId, "IN_PROGRESS");
}

export async function completeJob(
  businessId: string,
  userId: string,
  jobId: string,
  input: {
    workPerformed: string;
    findings?: string;
    recommendations?: string;
    customerComments?: string;
    internalNotes?: string;
    customerApproved?: boolean;
  },
) {
  const workPerformed = input.workPerformed.trim();
  if (!workPerformed) throw new Error("Work performed is required before completing the job.");

  return db.$transaction(async (tx) => {
    const job = await tx.job.findFirst({
      where: { id: jobId, businessId, archivedAt: null },
      include: {
        completion: true,
        assignments: { where: { isPrimary: true }, take: 1 },
      },
    });
    if (!job) throw new Error("Job not found.");
    if (job.completion) throw new Error("This job has already been completed.");
    if (["CANCELLED", "FAILED"].includes(job.status)) {
      throw new Error("A cancelled or failed job cannot be completed.");
    }

    const now = new Date();
    const completion = await tx.jobCompletion.create({
      data: {
        jobId: job.id,
        completedById: userId,
        completedAt: now,
        workPerformed,
        findings: input.findings?.trim() || null,
        recommendations: input.recommendations?.trim() || null,
        customerComments: input.customerComments?.trim() || null,
        internalNotes: input.internalNotes?.trim() || null,
        customerApproved: Boolean(input.customerApproved),
        customerApprovedAt: input.customerApproved ? now : null,
      },
    });

    await tx.job.update({
      where: { id: job.id },
      data: {
        status: "COMPLETED",
        actualStart: job.actualStart ?? now,
        actualEnd: now,
      },
    });

    const assignment = job.assignments[0];
    if (assignment) {
      await tx.jobAssignment.update({
        where: { id: assignment.id },
        data: {
          status: "COMPLETED",
          startedAt: assignment.startedAt ?? job.actualStart ?? now,
          completedAt: now,
        },
      });
    }

    await tx.jobStatusHistory.create({
      data: {
        jobId: job.id,
        fromStatus: job.status,
        toStatus: "COMPLETED",
        changedById: userId,
        reason: "Job completed with service completion record.",
      },
    });

    return completion;
  });
}

export async function getExecutionJob(businessId: string, jobId: string) {
  return db.job.findFirst({
    where: { id: jobId, businessId, archivedAt: null },
    include: {
      customer: true,
      site: true,
      service: true,
      contract: true,
      assignments: {
        where: { isPrimary: true },
        include: { staff: true },
        take: 1,
      },
      completion: { include: { reports: { orderBy: { createdAt: "desc" }, take: 1 } } },
      materials: { orderBy: { id: "asc" } },
      notes: { where: { archivedAt: null }, orderBy: { createdAt: "desc" }, take: 20 },
      attachments: { where: { archivedAt: null }, orderBy: { createdAt: "desc" }, take: 20 },
      statusHistory: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
}


export async function getOrCreateServiceReport(businessId: string, userId: string, jobId: string) {
  return db.$transaction(async (tx) => {
    const job = await tx.job.findFirst({
      where: { id: jobId, businessId, archivedAt: null },
      include: {
        customer: true,
        site: true,
        service: true,
        completion: {
          include: {
            completedBy: true,
            reports: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        },
        assignments: {
          where: { isPrimary: true },
          include: { staff: true },
          take: 1,
        },
      },
    });

    if (!job) throw new Error("Job not found.");
    if (!job.completion) throw new Error("Complete the job before generating a service report.");

    const existing = job.completion.reports[0];
    if (existing) return existing;

    const report = await tx.serviceReport.create({
      data: {
        completionId: job.completion.id,
        reportNumber: `SR-${job.jobNumber}`,
        status: "GENERATED",
        generatedAt: new Date(),
      },
    });

    return report;
  });
}

export async function getServiceReport(businessId: string, jobId: string) {
  return db.serviceReport.findFirst({
    where: {
      completion: {
        job: { id: jobId, businessId, archivedAt: null },
      },
    },
    include: {
      completion: {
        include: {
          job: {
            include: {
              customer: true,
              site: true,
              service: true,
              business: true,
              assignments: {
                where: { isPrimary: true },
                include: { staff: true },
                take: 1,
              },
            },
          },
          completedBy: true,
        },
      },
    },
  });
}
