import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerAccount } from "@/lib/accounts/persistence";
import { requireTenant } from "@/lib/tenant/require-tenant";

function money(value: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}

function name(c: { firstName: string|null; lastName: string|null; companyName: string|null }) {
  return c.companyName?.trim() || [c.firstName, c.lastName].filter(Boolean).join(" ").trim() || "Unnamed customer";
}

export default async function CustomerAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const context = await requireTenant();
  const { id } = await params;
  const account = await getCustomerAccount(context.businessId, id);
  if (!account) notFound();

  return <main className="p-8"><div className="mx-auto max-w-7xl">
    <div className="flex items-start justify-between gap-4">
      <div><p className="text-sm font-semibold text-blue-600">ACCOUNTS RECEIVABLE</p><h1 className="mt-1 text-3xl font-bold">{name(account.customer)}</h1><p className="mt-2 text-sm text-gray-500">{account.customer.customerNumber} · {account.currencies.join(", ") || "No financial activity"}</p></div>
      <div className="flex flex-wrap gap-3">
        <Link href={`/customers/${id}/statement`} className="rounded-lg border bg-white px-4 py-2.5 font-semibold">Statement</Link>
        <Link href={`/customers/${id}`} className="rounded-lg border bg-white px-4 py-2.5 font-semibold">Back to customer</Link>
      </div>
    </div>

    <div className="mt-7 space-y-5">
      {account.currencies.map(currency => {
        const x = account.byCurrency[currency];
        return <section key={currency} className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><div><h2 className="font-semibold">Accounts Receivable · {currency}</h2><p className="mt-1 text-xs text-gray-500">Posted/issued receivables only. Draft, void and cancelled invoices are excluded.</p></div><p className="text-2xl font-bold">{money(x.outstanding,currency)}</p></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <div className="rounded-xl border p-4"><p className="text-xs text-gray-500">Invoiced</p><p className="mt-1 font-semibold">{money(x.invoiced,currency)}</p></div>
            <div className="rounded-xl border p-4"><p className="text-xs text-gray-500">Collected</p><p className="mt-1 font-semibold">{money(x.collected,currency)}</p></div>
            <div className="rounded-xl border p-4"><p className="text-xs text-gray-500">Current</p><p className="mt-1 font-semibold">{money(x.aging.CURRENT,currency)}</p></div>
            <div className="rounded-xl border p-4"><p className="text-xs text-gray-500">1–30 Days</p><p className="mt-1 font-semibold">{money(x.aging.DAYS_1_30,currency)}</p></div>
            <div className="rounded-xl border p-4"><p className="text-xs text-gray-500">31–60 Days</p><p className="mt-1 font-semibold">{money(x.aging.DAYS_31_60,currency)}</p></div>
            <div className="rounded-xl border p-4"><p className="text-xs text-gray-500">61–90 / 90+ Days</p><p className="mt-1 font-semibold">{money(x.aging.DAYS_61_90 + x.aging.DAYS_90_PLUS,currency)}</p></div>
          </div>
        </section>
      })}
      {account.currencies.length === 0 && <div className="rounded-2xl border bg-white p-6 text-gray-500">No invoices or payments yet.</div>}
    </div>

    <section className="mt-7 overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-6"><h2 className="font-semibold">Invoice account</h2><p className="mt-1 text-sm text-gray-500">Receivables are shown separately by currency.</p></div>
      <div className="divide-y">{account.invoices.length === 0 ? <p className="p-6 text-sm text-gray-500">No invoices.</p> : account.invoices.map(inv => <div key={inv.id} className="grid gap-3 p-5 md:grid-cols-[1.2fr_1fr_1fr_1fr_120px] md:items-center"><div><Link className="font-semibold text-blue-600 hover:underline" href={`/invoices/${inv.id}`}>{inv.invoiceNumber}</Link><p className="text-xs text-gray-400">{new Date(inv.issueDate).toLocaleDateString()} · {inv.status.replaceAll("_"," ")}</p></div><div className="text-sm">{money(Number(inv.totalAmount),inv.currency)}</div><div className="text-sm">Paid {money(Number(inv.amountPaid),inv.currency)}</div><div className="text-sm font-semibold">Due {money(Number(inv.balanceDue),inv.currency)}</div><div><span className="rounded-full border px-2 py-1 text-xs font-semibold">{inv.agingBucket === "CURRENT" ? "CURRENT" : inv.agingBucket.replace("DAYS_","").replace("_","–").replace("PLUS","+")}</span>{inv.daysOverdue > 0 && <p className="mt-1 text-xs text-gray-400">{inv.daysOverdue} days overdue</p>}</div><span className="text-xs font-semibold">{inv.currency}</span></div>)}</div>
    </section>

    <section className="mt-7 overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-6"><h2 className="font-semibold">Payment history</h2></div>
      <div className="divide-y">{account.payments.length === 0 ? <p className="p-6 text-sm text-gray-500">No payments.</p> : account.payments.map(p => <div key={p.id} className="flex items-center justify-between gap-4 p-5"><div><p className="font-medium">{p.method.replaceAll("_"," ")}</p><p className="text-xs text-gray-400">{p.status} · {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "Pending"}</p></div><p className="font-semibold">{money(Number(p.amount),p.currency)}</p></div>)}</div>
    </section>
  </div></main>;
}
