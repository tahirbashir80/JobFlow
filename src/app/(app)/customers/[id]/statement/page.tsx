import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerStatements } from "@/lib/accounts/persistence";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { PrintStatementButton } from "./PrintStatementButton";

function money(value: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}
function customerName(c: { firstName: string|null; lastName: string|null; companyName: string|null }) {
  return c.companyName?.trim() || [c.firstName, c.lastName].filter(Boolean).join(" ").trim() || "Unnamed customer";
}

export default async function CustomerStatementPage({ params }: { params: Promise<{ id: string }> }) {
  const context = await requireTenant();
  const { id } = await params;
  const data = await getCustomerStatements(context.businessId, id);
  if (!data) notFound();

  return <main className="min-h-screen bg-gray-100 p-6 print:bg-white print:p-0">
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex items-center justify-between print:hidden">
        <Link href={`/customers/${id}/account`} className="text-sm font-medium text-blue-600">← Back to Account</Link>
        <PrintStatementButton />
      </div>

      <article className="bg-white p-8 shadow-sm print:shadow-none sm:p-12">
        <header className="flex flex-col gap-6 border-b pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Statement of Account</p>
            <h1 className="mt-2 text-3xl font-bold">{data.business?.name ?? "JobFlow"}</h1>
            <p className="mt-2 text-sm text-gray-500">{[data.business?.address, data.business?.city, data.business?.state, data.business?.postalCode].filter(Boolean).join(", ")}</p>
            <p className="text-sm text-gray-500">{[data.business?.phone, data.business?.email, data.business?.website].filter(Boolean).join(" · ")}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm font-semibold">Statement date</p>
            <p className="mt-1 text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
            <p className="mt-2 text-xs text-gray-400">All posted financial activity</p>
          </div>
        </header>

        <section className="mt-8 rounded-xl border p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Customer</p>
          <h2 className="mt-2 text-xl font-bold">{customerName(data.customer)}</h2>
          <p className="mt-1 text-sm text-gray-500">{data.customer.customerNumber}</p>
          <p className="mt-1 text-sm text-gray-500">{[data.customer.phone, data.customer.email].filter(Boolean).join(" · ")}</p>
        </section>

        {data.currencies.length === 0 ? <div className="mt-8 rounded-xl border p-8 text-center text-sm text-gray-500">No posted invoices or cleared payments exist for this customer.</div> :
          <div className="mt-8 space-y-10">{data.currencies.map(currency => {
            const statement = data.statements[currency];
            return <section key={currency}>
              <div className="flex items-end justify-between border-b pb-3"><div><h2 className="text-lg font-bold">Statement · {currency}</h2><p className="text-xs text-gray-400">Opening balance: {money(statement.openingBalance,currency)}</p></div><p className="text-lg font-bold">{money(statement.closingBalance,currency)}</p></div>
              <div className="mt-4 overflow-hidden rounded-xl border">
                <div className="grid grid-cols-[110px_1fr_90px_90px_110px] gap-3 bg-gray-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500"><span>Date</span><span>Reference</span><span>Debit</span><span>Credit</span><span className="text-right">Balance</span></div>
                <div className="divide-y">{statement.rows.map(row => <div key={row.id} className="grid grid-cols-[110px_1fr_90px_90px_110px] gap-3 px-4 py-3 text-sm"><span>{new Date(row.date).toLocaleDateString()}</span><span><span className="font-semibold">{row.reference}</span><span className="ml-2 text-xs text-gray-400">{row.description}</span></span><span>{row.debit ? money(row.debit,currency) : "—"}</span><span>{row.credit ? money(row.credit,currency) : "—"}</span><span className="text-right font-semibold">{money(row.balance,currency)}</span></div>)}</div>
                <div className="grid grid-cols-3 border-t bg-gray-50 px-4 py-4 text-sm"><div><span className="text-gray-500">Debits</span><p className="font-semibold">{money(statement.totalDebits,currency)}</p></div><div><span className="text-gray-500">Credits</span><p className="font-semibold">{money(statement.totalCredits,currency)}</p></div><div className="text-right"><span className="text-gray-500">Closing balance</span><p className="text-lg font-bold">{money(statement.closingBalance,currency)}</p></div></div>
              </div>
            </section>;
          })}</div>}

        <footer className="mt-12 border-t pt-5 text-xs text-gray-400">Generated by JobFlow · Draft invoices, void invoices and cancelled invoices are excluded from this statement.</footer>
      </article>
    </div>
  </main>;
}
