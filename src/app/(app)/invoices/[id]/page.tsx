import Link from "next/link";
import { notFound } from "next/navigation";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { customerName, getInvoice } from "@/lib/invoices/persistence";
import { markInvoiceSentAction, recordPaymentAction, clearChequePaymentAction, bounceChequePaymentAction, updateInvoicePricingAction, refreshInvoiceStatusAction, voidInvoiceAction, cancelInvoiceAction } from "../actions";
import { PaymentForm } from "./PaymentForm";

function money(value: number, currency = "USD") { return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value); }

type InvoiceItemRow = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
};

type PaymentRow = {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  paidAt: Date | string | null;
  chequeNumber: string | null;
  chequeBank: string | null;
  notes: string | null;
};

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const context = await requireTenant();
  const { id } = await params;
  const invoice = await getInvoice(context.businessId, id);
  if (!invoice) notFound();

  return <main className="p-8"><div className="mx-auto max-w-6xl">
    <Link href="/invoices" className="text-sm font-medium text-blue-600">← Invoices</Link>
    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-mono text-sm text-gray-400">{invoice.invoiceNumber} · {invoice.currency}</p><h1 className="mt-1 text-3xl font-bold">Invoice</h1><p className="mt-2 text-gray-500">{invoice.customer ? customerName(invoice.customer) : "—"}</p></div><div className="flex flex-wrap gap-2">{invoice.job && <Link href={`/jobs/${invoice.job.id}`} className="rounded-lg border px-4 py-2.5 font-medium">View Job</Link>}{invoice.status === "DRAFT" && <form action={markInvoiceSentAction.bind(null, invoice.id)}><button className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white">Mark sent</button></form>}{invoice.status === "SENT" && <form action={refreshInvoiceStatusAction.bind(null, invoice.id)}><button className="rounded-lg border px-4 py-2.5 font-medium">Refresh status</button></form>}{["DRAFT","SENT"].includes(invoice.status) && <form action={cancelInvoiceAction.bind(null, invoice.id)}><button className="rounded-lg border px-4 py-2.5 font-medium">Cancel</button></form>}{["SENT","OVERDUE"].includes(invoice.status) && <form action={voidInvoiceAction.bind(null, invoice.id)}><button className="rounded-lg border px-4 py-2.5 font-medium">Void</button></form>}</div></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <section className="rounded-2xl border bg-white shadow-sm"><div className="border-b p-6"><h2 className="font-semibold">Line items</h2><p className="mt-1 text-sm text-gray-500">{invoice.job?.jobNumber ? `Created from ${invoice.job.jobNumber}` : "Invoice items"}</p></div><div className="divide-y">{invoice.items.map((item: InvoiceItemRow) => <div key={item.id} className="grid grid-cols-[1fr_120px_140px] gap-4 p-5"><div><p className="font-medium">{item.description}</p><p className="mt-1 text-xs text-gray-400">Qty {item.quantity}</p></div><p className="text-right text-sm">{money(item.unitPrice, invoice.currency)}</p><p className="text-right font-semibold">{money(item.totalAmount, invoice.currency)}</p></div>)}</div><div className="border-t p-6"><dl className="ml-auto max-w-sm space-y-2 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{money(invoice.subtotal, invoice.currency)}</dd></div><div className="flex justify-between"><dt>Discount{invoice.discountType==="PERCENT" ? ` (${invoice.discountRate}%)` : ""}</dt><dd>-{money(invoice.discountAmount, invoice.currency)}</dd></div><div className="flex justify-between"><dt>Adjustment{invoice.adjustmentReason ? ` (${invoice.adjustmentReason})` : ""}</dt><dd>{invoice.adjustmentAmount >= 0 ? "+" : ""}{money(invoice.adjustmentAmount, invoice.currency)}</dd></div><div className="flex justify-between"><dt>Tax{invoice.taxType==="PERCENT" ? ` (${invoice.taxRate}%)` : ""}</dt><dd>{money(invoice.taxAmount, invoice.currency)}</dd></div><div className="flex justify-between border-t pt-3 text-base font-bold"><dt>Total</dt><dd>{money(invoice.totalAmount, invoice.currency)}</dd></div></dl></div></section>
      <aside className="space-y-6"><section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold">Pricing adjustments</h2>
        <p className="mt-1 text-sm text-gray-500">Discount, tax and adjustment are recalculated from the invoice subtotal.</p>
        {["DRAFT","SENT","PARTIALLY_PAID"].includes(invoice.status) ? <form action={updateInvoicePricingAction.bind(null, invoice.id)} className="mt-5 space-y-4">
          <div><label className="text-sm font-medium">Discount</label><div className="mt-1 flex gap-2"><input name="discountRate" type="number" min="0" step="0.01" defaultValue={invoice.discountType==="PERCENT" ? invoice.discountRate : invoice.discountAmount} className="min-w-0 flex-1 rounded-lg border px-3 py-2.5"/><select name="discountType" defaultValue={invoice.discountType} className="rounded-lg border bg-white px-3 py-2.5"><option value="FIXED">Amount</option><option value="PERCENT">%</option></select></div></div>
          <div><label className="text-sm font-medium">Adjustment (+ / -)</label><input name="adjustmentAmount" type="number" step="0.01" defaultValue={invoice.adjustmentAmount} className="mt-1 w-full rounded-lg border px-3 py-2.5"/><p className="mt-1 text-xs text-gray-400">Positive adds to the invoice; negative reduces it.</p></div>
          <div><label className="text-sm font-medium">Adjustment reason</label><input name="adjustmentReason" defaultValue={invoice.adjustmentReason ?? ""} placeholder="e.g. Customer concession" className="mt-1 w-full rounded-lg border px-3 py-2.5"/></div>
          <div><label className="text-sm font-medium">Tax</label><div className="mt-1 flex gap-2"><input name="taxRate" type="number" min="0" step="0.01" defaultValue={invoice.taxType==="PERCENT" ? invoice.taxRate : invoice.taxAmount} className="min-w-0 flex-1 rounded-lg border px-3 py-2.5"/><select name="taxType" defaultValue={invoice.taxType} className="rounded-lg border bg-white px-3 py-2.5"><option value="FIXED">Amount</option><option value="PERCENT">%</option></select></div></div>
          <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white">Save Pricing</button>
        </form> : <p className="mt-4 text-sm text-gray-500">Pricing is locked for this invoice status.</p>}
      </section>
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold">Payment summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between"><dt>Total</dt><dd>{money(invoice.totalAmount, invoice.currency)}</dd></div>
          <div className="flex justify-between"><dt>Paid</dt><dd>{money(invoice.amountPaid, invoice.currency)}</dd></div>
          <div className="flex justify-between text-base font-bold"><dt>Balance due</dt><dd>{money(invoice.balanceDue, invoice.currency)}</dd></div>
        </dl>
        <p className="mt-5 text-sm text-gray-500">Status: <strong>{invoice.status.replaceAll("_", " ")}</strong></p><p className="mt-2 text-xs text-gray-400">Lifecycle: Draft → Sent → Partially Paid → Paid. Overdue is determined from the due date when an outstanding sent invoice is refreshed.</p>
      </section>
      {invoice.balanceDue > 0 && ["SENT","PARTIALLY_PAID","OVERDUE"].includes(invoice.status) && <section className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="font-semibold">Record payment</h2><p className="mt-1 text-sm text-gray-500">Choose whether this collection is full or partial, then select the payment method.</p><PaymentForm invoiceId={invoice.id} balance={invoice.balanceDue} currency={invoice.currency} action={recordPaymentAction.bind(null, invoice.id)} /></section>}
      </aside>
    </div>
    <section className="mt-6 rounded-2xl border bg-white shadow-sm"><div className="border-b p-6"><h2 className="font-semibold">Payment history</h2><p className="mt-1 text-sm text-gray-500">Cleared payments reduce the invoice balance. Pending cheques do not.</p></div>{invoice.payments.length === 0 ? <p className="p-6 text-sm text-gray-500">No payments recorded.</p> : <div className="divide-y">{invoice.payments.map((payment: PaymentRow) => <div key={payment.id} className="flex items-center justify-between p-5"><div><p className="font-medium">{payment.method.replaceAll("_", " ")}</p><p className="mt-1 text-xs text-gray-400">{payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "Pending"}{payment.chequeNumber ? ` · Cheque ${payment.chequeNumber}` : ""}{payment.chequeBank ? ` · ${payment.chequeBank}` : ""}{payment.notes ? ` · ${payment.notes}` : ""}</p></div><div className="text-right"><p className="font-semibold">{money(payment.amount, payment.currency)}</p><p className="mt-1 text-xs font-medium text-gray-500">{payment.status}</p>{payment.method==="CHEQUE" && payment.status==="PENDING" && <div className="mt-2 flex gap-2"><form action={clearChequePaymentAction.bind(null,payment.id,invoice.id)}><button className="rounded-md border px-2 py-1 text-xs font-semibold">Clear</button></form><form action={bounceChequePaymentAction.bind(null,payment.id,invoice.id)}><button className="rounded-md border px-2 py-1 text-xs font-semibold">Bounce</button></form></div>}</div></div>)}</div>}</section>
  </div></main>;
}
