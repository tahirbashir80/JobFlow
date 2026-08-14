import Link from "next/link";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { customerName, listInvoices } from "@/lib/invoices/persistence";

const statuses = ["ALL", "DRAFT", "SENT", "PARTIALLY_PAID", "PAID", "OVERDUE", "VOID", "CANCELLED"];

function money(value: number, currency = "USD") { return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value); }

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const context = await requireTenant();
  const params = await searchParams;
  const status = params.status ?? "ALL";
  const invoices = await listInvoices(context.businessId, status);
  const currencySet = [...new Set(invoices.map(invoice => invoice.currency))];
  const mixedCurrencies = currencySet.length > 1;

  return <main className="p-8"><div className="mx-auto max-w-7xl">
    <div><p className="text-sm font-semibold text-blue-600">FINANCE</p><h1 className="mt-1 text-3xl font-bold">Invoices</h1><p className="mt-2 text-gray-500">Create invoices from completed Jobs and track payments.</p></div>
    <div className="mt-7 grid gap-4 md:grid-cols-3">
      <section className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Invoices</p><p className="mt-2 text-2xl font-bold">{invoices.length}</p></section>
      <section className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Currencies</p><p className="mt-2 text-2xl font-bold">{currencySet.length}</p></section>
      <section className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Currency scope</p><p className="mt-2 text-sm font-semibold">{mixedCurrencies ? "Mixed currencies — totals shown per invoice" : (currencySet[0] ?? "—")}</p></section>
    </div>
    <form className="mt-7 flex gap-3" action="/invoices"><select name="status" defaultValue={status} className="rounded-lg border bg-white px-4 py-2.5">{statuses.map(item => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select><button className="rounded-lg border bg-white px-4 py-2.5 font-medium">Filter</button></form>
    <div className="mt-5 overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="grid grid-cols-[140px_1.4fr_140px_140px_140px_120px] border-b bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"><span>Invoice</span><span>Customer / Job</span><span>Issue date</span><span>Total</span><span>Balance</span><span>Status</span></div>
      {invoices.length === 0 ? <div className="p-10 text-center text-gray-500">No invoices found. Complete a Job and create its first invoice.</div> : invoices.map(invoice => <Link key={invoice.id} href={`/invoices/${invoice.id}`} className="grid grid-cols-[140px_1.4fr_140px_140px_140px_120px] items-center border-b px-5 py-4 last:border-b-0 hover:bg-gray-50">
        <div className="font-mono text-sm font-semibold">{invoice.invoiceNumber}</div>
        <div><p className="font-semibold">{invoice.customer ? customerName(invoice.customer) : "—"}</p><p className="mt-1 text-xs text-gray-400">{invoice.job?.jobNumber ?? "Standalone invoice"}</p></div>
        <div className="text-sm text-gray-600">{new Date(invoice.issueDate).toLocaleDateString()}</div><div className="text-sm font-semibold">{money(invoice.totalAmount, invoice.currency)}</div><div className="text-sm">{money(invoice.balanceDue, invoice.currency)}</div><div><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold">{invoice.status.replaceAll("_", " ")}</span></div>
      </Link>)}
    </div>
  </div></main>;
}
