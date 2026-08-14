import { db } from "@/lib/db/prisma";

const money = (v: unknown) => Number(v ?? 0);

export async function getCustomerAccount(businessId: string, customerId: string) {
  const customer = await db.customer.findFirst({
    where: { id: customerId, businessId, archivedAt: null },
    select: { id: true, customerNumber: true, firstName: true, lastName: true, companyName: true },
  });
  if (!customer) return null;

  const [invoices, payments, transactions] = await Promise.all([
    db.invoice.findMany({
      where: { businessId, customerId, archivedAt: null },
      orderBy: { issueDate: "desc" },
      select: {
        id: true, invoiceNumber: true, currency: true, status: true, issueDate: true, dueDate: true,
        totalAmount: true, amountPaid: true, balanceDue: true,
      },
    }),
    db.payment.findMany({
      where: { businessId, customerId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, invoiceId: true, amount: true, currency: true, amountInInvoiceCurrency: true,
        method: true, status: true, paidAt: true, createdAt: true, notes: true,
      },
    }),
    db.customerAccountTransaction.findMany({
      where: { businessId, customerId },
      orderBy: [{ transactionDate: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  const currencies = [...new Set([
    ...invoices.map(i => i.currency),
    ...payments.map(p => p.currency),
  ])];

  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;

  const getAgingBucket = (invoice: { dueDate: Date | null; balanceDue: unknown; status: string }) => {
    const balance = money(invoice.balanceDue);
    if (balance <= 0 || ["PAID", "VOID", "CANCELLED"].includes(invoice.status)) return "CURRENT";
    if (!invoice.dueDate) return "CURRENT";
    const daysOverdue = Math.max(0, Math.floor((now.getTime() - invoice.dueDate.getTime()) / dayMs));
    if (daysOverdue <= 0) return "CURRENT";
    if (daysOverdue <= 30) return "DAYS_1_30";
    if (daysOverdue <= 60) return "DAYS_31_60";
    if (daysOverdue <= 90) return "DAYS_61_90";
    return "DAYS_90_PLUS";
  };

  const byCurrency = Object.fromEntries(currencies.map(currency => {
    const inv = invoices.filter(i => i.currency === currency && !["DRAFT", "VOID", "CANCELLED"].includes(i.status));
    const paid = payments.filter(p => p.currency === currency && p.status === "SUCCEEDED");
    const invoiced = inv.reduce((s, i) => s + money(i.totalAmount), 0);
    const collected = paid.reduce((s, p) => s + money(p.amount), 0);
    const outstanding = inv.reduce((s, i) => s + money(i.balanceDue), 0);
    const aging = { CURRENT: 0, DAYS_1_30: 0, DAYS_31_60: 0, DAYS_61_90: 0, DAYS_90_PLUS: 0 };
    inv.forEach(i => {
      const bucket = getAgingBucket(i);
      aging[bucket as keyof typeof aging] += money(i.balanceDue);
    });
    const overdue = aging.DAYS_1_30 + aging.DAYS_31_60 + aging.DAYS_61_90 + aging.DAYS_90_PLUS;
    return [currency, { invoiced, collected, outstanding, overdue, aging }];
  }));

  const invoicesWithAging = invoices.map(invoice => ({
    ...invoice,
    agingBucket: getAgingBucket(invoice),
    daysOverdue: invoice.dueDate && Number(invoice.balanceDue) > 0 && invoice.status !== "PAID"
      ? Math.max(0, Math.floor((now.getTime() - invoice.dueDate.getTime()) / dayMs))
      : 0,
  }));

  return { customer, invoices: invoicesWithAging, payments, transactions, currencies, byCurrency };
}

export async function getCustomerStatements(businessId: string, customerId: string) {
  const customer = await db.customer.findFirst({
    where: { id: customerId, businessId, archivedAt: null },
    select: {
      id: true, customerNumber: true, firstName: true, lastName: true, companyName: true,
      email: true, phone: true,
    },
  });
  if (!customer) return null;

  const [business, invoices, payments] = await Promise.all([
    db.business.findUnique({
      where: { id: businessId },
      select: { name: true, email: true, phone: true, website: true, address: true, city: true, state: true, postalCode: true },
    }),
    db.invoice.findMany({
      where: {
        businessId,
        customerId,
        archivedAt: null,
        status: { notIn: ["DRAFT", "VOID", "CANCELLED"] },
      },
      orderBy: [{ issueDate: "asc" }, { createdAt: "asc" }],
      select: {
        id: true, invoiceNumber: true, currency: true, issueDate: true, totalAmount: true,
        balanceDue: true, status: true,
      },
    }),
    db.payment.findMany({
      where: {
        businessId,
        customerId,
        status: "SUCCEEDED",
        invoice: {
          status: { notIn: ["DRAFT", "VOID", "CANCELLED"] },
        },
      },
      orderBy: [{ paidAt: "asc" }, { createdAt: "asc" }],
      select: {
        id: true, invoiceId: true, amount: true, currency: true, paidAt: true, createdAt: true,
        method: true, notes: true,
        invoice: { select: { invoiceNumber: true } },
      },
    }),
  ]);

  const currencies = [...new Set([
    ...invoices.map(i => i.currency),
    ...payments.map(p => p.currency),
  ])];

  const statements = Object.fromEntries(currencies.map(currency => {
    const entries = [
      ...invoices.filter(i => i.currency === currency).map(i => ({
        id: `invoice-${i.id}`,
        date: i.issueDate,
        reference: i.invoiceNumber,
        type: "INVOICE" as const,
        description: "Invoice",
        debit: money(i.totalAmount),
        credit: 0,
      })),
      ...payments.filter(p => p.currency === currency).map(p => ({
        id: `payment-${p.id}`,
        date: p.paidAt ?? p.createdAt,
        reference: p.invoice?.invoiceNumber ?? "Payment",
        type: "PAYMENT" as const,
        description: `${p.method.replaceAll("_", " ")} payment`,
        debit: 0,
        credit: money(p.amount),
      })),
    ].sort((a,b) => a.date.getTime() - b.date.getTime());

    let balance = 0;
    const rows = entries.map(entry => {
      balance += entry.debit - entry.credit;
      return { ...entry, balance };
    });

    return [currency, {
      openingBalance: 0,
      rows,
      closingBalance: balance,
      totalDebits: rows.reduce((sum, row) => sum + row.debit, 0),
      totalCredits: rows.reduce((sum, row) => sum + row.credit, 0),
    }];
  }));

  return { customer, business, currencies, statements };
}
