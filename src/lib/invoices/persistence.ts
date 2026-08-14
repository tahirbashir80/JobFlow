import { db } from "@/lib/db/prisma";
import { InvoiceStatus, PaymentMethod, PaymentStatus } from "@/generated/prisma/client";

function money(value: unknown) {
  if (value === null || value === undefined) return 0;
  const n = Number(value.toString());
  return Number.isFinite(n) ? n : 0;
}

function plainInvoice(invoice: any) {
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    currency: invoice.currency,
    status: invoice.status,
    issueDate: invoice.issueDate.toISOString(),
    dueDate: invoice.dueDate?.toISOString() ?? null,
    subtotal: money(invoice.subtotal),
    discountType: invoice.discountType,
    discountRate: money(invoice.discountRate),
    discountAmount: money(invoice.discountAmount),
    adjustmentAmount: money(invoice.adjustmentAmount),
    adjustmentReason: invoice.adjustmentReason,
    taxType: invoice.taxType,
    taxRate: money(invoice.taxRate),
    taxAmount: money(invoice.taxAmount),
    totalAmount: money(invoice.totalAmount),
    amountPaid: money(invoice.amountPaid),
    balanceDue: money(invoice.balanceDue),
    notes: invoice.notes,
    customer: invoice.customer ? {
      id: invoice.customer.id,
      firstName: invoice.customer.firstName,
      lastName: invoice.customer.lastName,
      companyName: invoice.customer.companyName,
      email: invoice.customer.email,
      phone: invoice.customer.phone,
    } : null,
    job: invoice.job ? {
      id: invoice.job.id,
      jobNumber: invoice.job.jobNumber,
      title: invoice.job.title,
      status: invoice.job.status,
    } : null,
    items: invoice.items?.map((item: any) => ({
      id: item.id,
      description: item.description,
      quantity: money(item.quantity),
      unitPrice: money(item.unitPrice),
      taxAmount: money(item.taxAmount),
      discountAmount: money(item.discountAmount),
      totalAmount: money(item.totalAmount),
      service: item.service ? { id: item.service.id, name: item.service.name } : null,
    })) ?? [],
    payments: invoice.payments?.map((payment: any) => ({
      id: payment.id,
      amount: money(payment.amount),
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      paidAt: payment.paidAt?.toISOString() ?? null,
      chequeNumber: payment.chequeNumber,
      chequeBank: payment.chequeBank,
      chequeDate: payment.chequeDate?.toISOString() ?? null,
      clearedAt: payment.clearedAt?.toISOString() ?? null,
      notes: payment.notes,
    })) ?? [],
  };
}

export function customerName(customer: { firstName: string | null; lastName: string | null; companyName: string | null }) {
  return customer.companyName?.trim()
    || [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim()
    || "Unnamed customer";
}

export async function listInvoices(businessId: string, status?: string) {
  const invoices = await db.invoice.findMany({
    where: {
      businessId,
      archivedAt: null,
      ...(status && status !== "ALL" ? { status: status as InvoiceStatus } : {}),
    },
    include: {
      customer: { select: { id: true, firstName: true, lastName: true, companyName: true, email: true, phone: true } },
      job: { select: { id: true, jobNumber: true, title: true, status: true } },
    },
    orderBy: [{ issueDate: "desc" }, { createdAt: "desc" }],
  });
  return invoices.map((invoice) => plainInvoice(invoice));
}

export async function getInvoice(businessId: string, invoiceId: string) {
  const invoice = await db.invoice.findFirst({
    where: { id: invoiceId, businessId, archivedAt: null },
    include: {
      customer: true,
      job: { select: { id: true, jobNumber: true, title: true, status: true } },
      items: { include: { service: { select: { id: true, name: true } } } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });
  return invoice ? plainInvoice(invoice) : null;
}

export async function getInvoiceForJob(businessId: string, jobId: string) {
  const invoice = await db.invoice.findFirst({
    where: { businessId, jobId, archivedAt: null },
    select: { id: true, invoiceNumber: true, status: true, totalAmount: true, balanceDue: true },
  });
  if (!invoice) return null;
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    status: invoice.status,
    totalAmount: money(invoice.totalAmount),
    balanceDue: money(invoice.balanceDue),
  };
}

export async function createInvoiceFromJob(businessId: string, jobId: string, dueDays = 30) {
  return db.$transaction(async (tx) => {
    const business = await tx.business.findUnique({
      where: { id: businessId },
      select: { currency: true },
    });
    const job = await tx.job.findFirst({
      where: { id: jobId, businessId, archivedAt: null },
      include: {
        customer: { select: { id: true, companyName: true, firstName: true, lastName: true } },
        service: { select: { id: true, name: true } },
      },
    });
    if (!job) throw new Error("Job not found.");
    if (job.status !== "COMPLETED") throw new Error("Only completed Jobs can be invoiced.");

    const existing = await tx.invoice.findFirst({ where: { businessId, jobId, archivedAt: null }, select: { id: true } });
    if (existing) throw new Error("This Job already has an invoice.");

    const subtotal = money(job.price ?? job.totalAmount);
    const taxAmount = money(job.taxAmount);
    const discountAmount = money(job.discountAmount);
    const totalAmount = money(job.totalAmount ?? subtotal + taxAmount - discountAmount);
    if (totalAmount <= 0) throw new Error("The completed Job has no billable amount.");

    const count = await tx.invoice.count({ where: { businessId } });
    let invoiceNumber = `INV-${String(count + 1).padStart(6, "0")}`;
    let suffix = 1;
    while (await tx.invoice.findUnique({ where: { businessId_invoiceNumber: { businessId, invoiceNumber } } })) {
      invoiceNumber = `INV-${String(count + 1).padStart(6, "0")}-${suffix++}`;
    }

    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + Math.max(0, dueDays));

    const invoice = await tx.invoice.create({
      data: {
        businessId,
        customerId: job.customerId,
        jobId: job.id,
        invoiceNumber,
        currency: business?.currency ?? "USD",
        status: "DRAFT",
        issueDate,
        dueDate,
        subtotal: subtotal.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        amountPaid: "0.00",
        balanceDue: totalAmount.toFixed(2),
        items: {
          create: {
            serviceId: job.serviceId,
            description: job.service.name,
            quantity: "1.000",
            unitPrice: subtotal.toFixed(2),
            taxAmount: taxAmount.toFixed(2),
            discountAmount: discountAmount.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
          },
        },
      },
      select: { id: true, invoiceNumber: true },
    });

    return invoice;
  });
}


export async function updateInvoicePricing(
  businessId: string,
  invoiceId: string,
  input: {
    discountType: "FIXED" | "PERCENT";
    discountRate: number;
    taxType: "FIXED" | "PERCENT";
    taxRate: number;
    adjustmentAmount: number;
    adjustmentReason?: string;
  },
) {
  return db.$transaction(async (tx) => {
    const invoice = await tx.invoice.findFirst({
      where: { id: invoiceId, businessId, archivedAt: null },
      include: { payments: { select: { amount: true, status: true } } },
    });
    if (!invoice) throw new Error("Invoice not found.");
    if (!["DRAFT", "SENT", "PARTIALLY_PAID"].includes(invoice.status)) {
      throw new Error("Only draft, sent, or partially paid invoices can be adjusted.");
    }

    const subtotal = money(invoice.subtotal);
    const discountRate = Number(input.discountRate);
    const taxRate = Number(input.taxRate);
    const adjustmentAmount = Number(input.adjustmentAmount);

    if (![discountRate, taxRate, adjustmentAmount].every(Number.isFinite)) {
      throw new Error("Pricing values must be valid numbers.");
    }
    if (discountRate < 0 || taxRate < 0) throw new Error("Discount and tax cannot be negative.");
    if (input.discountType === "PERCENT" && discountRate > 100) throw new Error("Discount percentage cannot exceed 100%.");
    if (input.taxType === "PERCENT" && taxRate > 100) throw new Error("Tax percentage cannot exceed 100%.");

    const discountAmount = input.discountType === "PERCENT"
      ? subtotal * (discountRate / 100)
      : discountRate;

    const adjustedBase = Math.max(0, subtotal - discountAmount + adjustmentAmount);
    const taxAmount = input.taxType === "PERCENT"
      ? adjustedBase * (taxRate / 100)
      : taxRate;

    const totalAmount = Math.max(0, adjustedBase + taxAmount);

    const succeededPaid = invoice.payments
      .filter((p: any) => p.status === "SUCCEEDED")
      .reduce((sum: number, p: any) => sum + money(p.amount), 0);

    if (succeededPaid > totalAmount + 0.005) {
      throw new Error(`The new invoice total cannot be below the cleared payments of ${succeededPaid.toFixed(2)}.`);
    }

    const balanceDue = Math.max(0, totalAmount - succeededPaid);
    const status: InvoiceStatus =
      balanceDue <= 0.005 ? "PAID" : succeededPaid > 0 ? "PARTIALLY_PAID" : invoice.status === "DRAFT" ? "DRAFT" : "SENT";

    return tx.invoice.update({
      where: { id: invoice.id },
      data: {
        discountType: input.discountType,
        discountRate: discountRate.toFixed(4),
        discountAmount: discountAmount.toFixed(2),
        adjustmentAmount: adjustmentAmount.toFixed(2),
        adjustmentReason: input.adjustmentReason?.trim() || null,
        taxType: input.taxType,
        taxRate: taxRate.toFixed(4),
        taxAmount: taxAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        amountPaid: succeededPaid.toFixed(2),
        balanceDue: balanceDue.toFixed(2),
        status,
      },
    });
  });
}

export async function markInvoiceSent(businessId: string, invoiceId: string) {
  const invoice = await db.invoice.findFirst({ where: { id: invoiceId, businessId, archivedAt: null }, select: { id: true, status: true } });
  if (!invoice) throw new Error("Invoice not found.");
  if (invoice.status === "VOID" || invoice.status === "CANCELLED") throw new Error("This invoice cannot be sent.");
  return db.invoice.update({ where: { id: invoice.id }, data: { status: "SENT" } });
}

export async function recordPayment(
  businessId: string,
  invoiceId: string,
  input: {
    amount: number;
    method: PaymentMethod;
    notes?: string;
    chequeNumber?: string;
    chequeBank?: string;
    chequeDate?: Date | null;
    paymentType?: "FULL" | "PARTIAL";
  },
) {
  if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error("Payment amount must be greater than zero.");
  if (input.method === "CHEQUE" && !input.chequeNumber?.trim()) throw new Error("Cheque number is required for cheque payments.");

  return db.$transaction(async (tx) => {
    const invoice = await tx.invoice.findFirst({ where: { id: invoiceId, businessId, archivedAt: null } });
    if (!invoice) throw new Error("Invoice not found.");
    if (!["SENT", "PARTIALLY_PAID", "OVERDUE"].includes(invoice.status)) {
      throw new Error("Payments can only be recorded against sent or outstanding invoices.");
    }
    if (["VOID", "CANCELLED", "PAID"].includes(invoice.status)) throw new Error("This invoice cannot accept another payment.");

    const paymentCurrency = (await tx.business.findUnique({ where: { id: businessId }, select: { currency: true } }))?.currency ?? invoice.currency;
    if (paymentCurrency !== invoice.currency) {
      throw new Error(`Payment currency ${paymentCurrency} does not match invoice currency ${invoice.currency}.`);
    }

    const balanceDue = money(invoice.balanceDue);
    const paymentType = input.paymentType ?? "PARTIAL";
    if (input.amount > balanceDue + 0.005) throw new Error(`Payment exceeds the outstanding balance of ${balanceDue.toFixed(2)}.`);
    if (paymentType === "FULL" && Math.abs(input.amount - balanceDue) > 0.005) {
      throw new Error(`Full payment must equal the outstanding balance of ${balanceDue.toFixed(2)}.`);
    }
    if (paymentType === "PARTIAL" && input.amount >= balanceDue - 0.005) {
      throw new Error("A partial payment must be less than the outstanding balance."); 
    }

    const business = await tx.business.findUnique({ where: { id: businessId }, select: { currency: true } });
    const isCheque = input.method === "CHEQUE";
    const payment = await tx.payment.create({
      data: {
        businessId,
        customerId: invoice.customerId,
        invoiceId: invoice.id,
        amount: input.amount.toFixed(2),
        currency: invoice.currency,
        exchangeRateToInvoice: "1.00000000",
        amountInInvoiceCurrency: input.amount.toFixed(2),
        method: input.method,
        status: isCheque ? "PENDING" : "SUCCEEDED",
        paidAt: isCheque ? null : new Date(),
        chequeNumber: isCheque ? input.chequeNumber!.trim() : null,
        chequeBank: isCheque ? input.chequeBank?.trim() || null : null,
        chequeDate: isCheque ? input.chequeDate ?? null : null,
        notes: input.notes?.trim() || null,
      },
      select: { id: true },
    });

    // Only cleared/succeeded money reduces the invoice balance.
    if (!isCheque) {
      const amountPaid = money(invoice.amountPaid) + input.amount;
      const remaining = Math.max(0, money(invoice.totalAmount) - amountPaid);
      const status: InvoiceStatus = remaining <= 0.005 ? "PAID" : "PARTIALLY_PAID";
      await tx.invoice.update({
        where: { id: invoice.id },
        data: { amountPaid: amountPaid.toFixed(2), balanceDue: remaining.toFixed(2), status },
      });
    }

    return payment;
  });
}

async function recalculateInvoiceForPayments(
  tx: any,
  invoiceId: string,
) {
  const invoice = await tx.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) throw new Error("Invoice not found.");
  const payments = await tx.payment.findMany({
    where: { invoiceId, status: "SUCCEEDED" },
    select: { amount: true },
  });
  const paid = payments.reduce((sum: number, p: any) => sum + money(p.amount), 0);
  const total = money(invoice.totalAmount);
  const balance = Math.max(0, total - paid);
  const status: InvoiceStatus = balance <= 0.005 ? "PAID" : paid > 0 ? "PARTIALLY_PAID" : "SENT";
  await tx.invoice.update({
    where: { id: invoiceId },
    data: { amountPaid: paid.toFixed(2), balanceDue: balance.toFixed(2), status },
  });
  return { paid, balance };
}

export async function clearChequePayment(businessId: string, paymentId: string) {
  return db.$transaction(async (tx) => {
    const payment = await tx.payment.findFirst({
      where: { id: paymentId, businessId, method: "CHEQUE", status: "PENDING" },
    });
    if (!payment || !payment.invoiceId) throw new Error("Pending cheque payment not found.");
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCEEDED", paidAt: new Date(), clearedAt: new Date() },
    });
    return recalculateInvoiceForPayments(tx, payment.invoiceId);
  });
}

export async function bounceChequePayment(businessId: string, paymentId: string) {
  return db.$transaction(async (tx) => {
    const payment = await tx.payment.findFirst({
      where: { id: paymentId, businessId, method: "CHEQUE", status: "PENDING" },
    });
    if (!payment || !payment.invoiceId) throw new Error("Pending cheque payment not found.");
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    return recalculateInvoiceForPayments(tx, payment.invoiceId);
  });
}


export async function refreshInvoiceStatus(businessId: string, invoiceId: string) {
  return db.$transaction(async (tx) => {
    const invoice = await tx.invoice.findFirst({
      where: { id: invoiceId, businessId, archivedAt: null },
    });
    if (!invoice) throw new Error("Invoice not found.");
    if (["DRAFT", "VOID", "CANCELLED", "PAID", "PARTIALLY_PAID"].includes(invoice.status)) return invoice;

    const balance = money(invoice.balanceDue);
    const isOverdue = invoice.dueDate && invoice.dueDate < new Date() && balance > 0;
    if (isOverdue && invoice.status === "SENT") {
      return tx.invoice.update({ where: { id: invoice.id }, data: { status: "OVERDUE" } });
    }
    return invoice;
  });
}


export async function voidInvoice(businessId: string, invoiceId: string) {
  const invoice = await db.invoice.findFirst({
    where: { id: invoiceId, businessId, archivedAt: null },
    select: { id: true, status: true, amountPaid: true },
  });
  if (!invoice) throw new Error("Invoice not found.");
  if (money(invoice.amountPaid) > 0) throw new Error("An invoice with payments cannot be voided. Reverse or refund the payment first.");
  if (["PAID", "VOID", "CANCELLED"].includes(invoice.status)) throw new Error("This invoice cannot be voided.");
  return db.invoice.update({ where: { id: invoice.id }, data: { status: "VOID" } });
}

export async function cancelInvoice(businessId: string, invoiceId: string) {
  const invoice = await db.invoice.findFirst({
    where: { id: invoiceId, businessId, archivedAt: null },
    select: { id: true, status: true, amountPaid: true },
  });
  if (!invoice) throw new Error("Invoice not found.");
  if (money(invoice.amountPaid) > 0) throw new Error("An invoice with payments cannot be cancelled. Reverse or refund the payment first.");
  if (["PAID", "VOID", "CANCELLED"].includes(invoice.status)) throw new Error("This invoice cannot be cancelled.");
  return db.invoice.update({ where: { id: invoice.id }, data: { status: "CANCELLED" } });
}
