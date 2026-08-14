"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PaymentMethod } from "@/generated/prisma/client";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { createInvoiceFromJob, markInvoiceSent, updateInvoicePricing, recordPayment, clearChequePayment, bounceChequePayment, refreshInvoiceStatus, voidInvoice, cancelInvoice } from "@/lib/invoices/persistence";

export async function createInvoiceFromJobAction(jobId: string) {
  const context = await requireTenant();
  const invoice = await createInvoiceFromJob(context.businessId, jobId);
  revalidatePath("/invoices");
  revalidatePath(`/jobs/${jobId}`);
  redirect(`/invoices/${invoice.id}`);
}

export async function markInvoiceSentAction(invoiceId: string) {
  const context = await requireTenant();
  await markInvoiceSent(context.businessId, invoiceId);
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
}

export async function recordPaymentAction(invoiceId: string, formData: FormData) {
  const context = await requireTenant();
  const amount = Number(formData.get("amount"));
  const paymentType = String(formData.get("paymentType") || "PARTIAL");
  if (!["FULL", "PARTIAL"].includes(paymentType)) throw new Error("Invalid payment type.");
  const methodValue = String(formData.get("method") || "");
  if (!Object.values(PaymentMethod).includes(methodValue as PaymentMethod)) {
    throw new Error("Please select a valid payment method.");
  }
  const method = methodValue as PaymentMethod;
  const notes = String(formData.get("notes") || "");
  const chequeNumber = String(formData.get("chequeNumber") || "").trim();
  const chequeBank = String(formData.get("chequeBank") || "").trim();
  const chequeDateRaw = String(formData.get("chequeDate") || "").trim();
  const chequeDate = chequeDateRaw ? new Date(`${chequeDateRaw}T00:00:00`) : null;
  await recordPayment(context.businessId, invoiceId, { amount, method, notes, chequeNumber, chequeBank, chequeDate, paymentType: paymentType as "FULL" | "PARTIAL" });
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
}


export async function clearChequePaymentAction(paymentId: string, invoiceId: string) {
  const context = await requireTenant();
  await clearChequePayment(context.businessId, paymentId);
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
}

export async function bounceChequePaymentAction(paymentId: string, invoiceId: string) {
  const context = await requireTenant();
  await bounceChequePayment(context.businessId, paymentId);
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
}


export async function updateInvoicePricingAction(invoiceId: string, formData: FormData) {
  const context = await requireTenant();
  const discountType = String(formData.get("discountType") || "FIXED") as "FIXED" | "PERCENT";
  const discountRate = Number(formData.get("discountRate") || 0);
  const taxType = String(formData.get("taxType") || "FIXED") as "FIXED" | "PERCENT";
  const taxRate = Number(formData.get("taxRate") || 0);
  const adjustmentAmount = Number(formData.get("adjustmentAmount") || 0);
  const adjustmentReason = String(formData.get("adjustmentReason") || "");
  await updateInvoicePricing(context.businessId, invoiceId, {
    discountType, discountRate, taxType, taxRate, adjustmentAmount, adjustmentReason,
  });
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
}


export async function refreshInvoiceStatusAction(invoiceId: string) {
  const context = await requireTenant();
  await refreshInvoiceStatus(context.businessId, invoiceId);
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
}

export async function voidInvoiceAction(invoiceId: string) {
  const context = await requireTenant();
  await voidInvoice(context.businessId, invoiceId);
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
}

export async function cancelInvoiceAction(invoiceId: string) {
  const context = await requireTenant();
  await cancelInvoice(context.businessId, invoiceId);
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
}
