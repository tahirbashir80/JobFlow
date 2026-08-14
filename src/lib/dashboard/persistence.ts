import { db } from "@/lib/db/prisma";

function dayRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function monthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

function previousMonthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const end = new Date(date.getFullYear(), date.getMonth(), 1);
  return { start, end };
}

export async function getDashboardMetrics(businessId: string, now = new Date()) {
  const { start: monthStart, end: monthEnd } = monthRange(now);
  const { start: previousMonthStart, end: previousMonthEnd } = previousMonthRange(now);

  const business = await db.business.findUnique({
    where: { id: businessId },
    select: { name: true, currency: true },
  });

  const currency = business?.currency ?? "USD";

  const [
    monthJobs,
    monthCustomers,
    revenueAgg,
    previousRevenueAgg,
    previousJobsCount,
    previousCustomersCount,
    invoiceOutstanding,
    recentJobs,
    recentInvoices,
    statusGroups,
    staffAssignments,
  ] = await Promise.all([
    db.job.findMany({
      where: {
        businessId,
        archivedAt: null,
        createdAt: { gte: monthStart, lt: monthEnd },
      },
      select: {
        id: true,
        jobNumber: true,
        status: true,
        totalAmount: true,
        service: { select: { id: true, name: true } },
        customer: { select: { companyName: true, firstName: true, lastName: true } },
        assignments: {
          where: { isPrimary: true },
          take: 1,
          select: { staff: { select: { firstName: true, lastName: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.customer.count({
      where: { businessId, archivedAt: null, createdAt: { gte: monthStart, lt: monthEnd } },
    }),
    db.job.aggregate({
      where: {
        businessId,
        archivedAt: null,
        createdAt: { gte: monthStart, lt: monthEnd },
        status: "COMPLETED",
      },
      _sum: { totalAmount: true },
    }),
    db.job.aggregate({
      where: {
        businessId,
        archivedAt: null,
        createdAt: { gte: previousMonthStart, lt: previousMonthEnd },
        status: "COMPLETED",
      },
      _sum: { totalAmount: true },
    }),
    db.job.count({
      where: {
        businessId,
        archivedAt: null,
        createdAt: { gte: previousMonthStart, lt: previousMonthEnd },
      },
    }),
    db.customer.count({
      where: {
        businessId,
        archivedAt: null,
        createdAt: { gte: previousMonthStart, lt: previousMonthEnd },
      },
    }),
    db.invoice.aggregate({
      where: {
        businessId,
        archivedAt: null,
        currency,
        balanceDue: { gt: 0 },
        status: { in: ["SENT", "PARTIALLY_PAID", "OVERDUE"] },
      },
      _sum: { balanceDue: true },
      _count: { _all: true },
    }),
    db.job.findMany({
      where: { businessId, archivedAt: null },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        jobNumber: true,
        status: true,
        priority: true,
        createdAt: true,
        scheduledStart: true,
        service: { select: { name: true } },
        customer: { select: { companyName: true, firstName: true, lastName: true } },
        assignments: {
          where: { isPrimary: true },
          take: 1,
          select: { staff: { select: { firstName: true, lastName: true } } },
        },
      },
    }),
    db.invoice.findMany({
      where: { businessId, archivedAt: null, currency },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        totalAmount: true,
        balanceDue: true,
        issueDate: true,
        customer: { select: { companyName: true, firstName: true, lastName: true } },
      },
    }),
    db.job.groupBy({
      by: ["status"],
      where: { businessId, archivedAt: null },
      _count: { _all: true },
    }),
    db.jobAssignment.findMany({
      where: {
        businessId,
        status: { notIn: ["CANCELLED", "DECLINED"] },
        job: {
          archivedAt: null,
          createdAt: { gte: monthStart, lt: monthEnd },
        },
      },
      select: {
        staff: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
  ]);

  const customerName = (customer: {
    companyName: string | null;
    firstName: string | null;
    lastName: string | null;
  }) =>
    customer.companyName?.trim() ||
    [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim() ||
    "Customer";

  const staffName = (staff: { firstName: string; lastName: string | null } | null) =>
    staff ? `${staff.firstName} ${staff.lastName ?? ""}`.trim() : "Unassigned";

  const revenueByServiceMap = new Map<string, number>();
  for (const job of monthJobs) {
    const amount = Number(job.totalAmount ?? 0);
    revenueByServiceMap.set(
      job.service.name,
      (revenueByServiceMap.get(job.service.name) ?? 0) + amount,
    );
  }

  const revenueByService = [...revenueByServiceMap.entries()]
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  const staffMap = new Map<string, { name: string; count: number }>();
  for (const assignment of staffAssignments) {
    const name = staffName(assignment.staff);
    const current = staffMap.get(name);
    staffMap.set(name, { name, count: (current?.count ?? 0) + 1 });
  }

  const jobsByStaff = [...staffMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const jobStatus = statusGroups
    .map(item => ({ status: item.status, count: item._count._all }))
    .sort((a, b) => b.count - a.count);

  return {
    businessName: business?.name ?? "Your business",
    currency,
    totalRevenue: Number(revenueAgg._sum.totalAmount ?? 0),
    jobsThisMonth: monthJobs.length,
    newCustomersThisMonth: monthCustomers,
    previousMonthRevenue: Number(previousRevenueAgg._sum.totalAmount ?? 0),
    previousMonthJobs: previousJobsCount,
    previousMonthCustomers: previousCustomersCount,
    outstandingInvoices: Number(invoiceOutstanding._sum.balanceDue ?? 0),
    outstandingInvoiceCount: invoiceOutstanding._count._all,
    recentJobs: recentJobs.map(job => ({
      id: job.id,
      jobNumber: job.jobNumber,
      status: job.status,
      priority: job.priority,
      createdAt: job.createdAt.toISOString(),
      scheduledStart: job.scheduledStart?.toISOString() ?? null,
      service: job.service.name,
      customer: customerName(job.customer),
      staff: staffName(job.assignments[0]?.staff ?? null),
    })),
    recentInvoices: recentInvoices.map(invoice => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      totalAmount: Number(invoice.totalAmount),
      balanceDue: Number(invoice.balanceDue),
      issueDate: invoice.issueDate.toISOString(),
      customer: customerName(invoice.customer),
    })),
    revenueByService,
    jobsByStaff,
    jobStatus,
  };
}
