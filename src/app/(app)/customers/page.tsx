import Link from "next/link";
import { Plus, Building2, MapPinned, FileCheck2, CalendarClock } from "lucide-react";
import { listCustomers, getCustomerListSummary, customerName } from "@/lib/customers/persistence";
import { requireTenant } from "@/lib/tenant/require-tenant";
import CustomerDirectory from "@/components/customers/CustomerDirectory";

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function mapQuery(customers: Awaited<ReturnType<typeof listCustomers>>) {
  const site = customers.flatMap((customer) => customer.sites).find((item) => item.address || item.city || item.latitude || item.longitude);
  if (!site) return null;
  if (site.latitude != null && site.longitude != null) return `${site.latitude},${site.longitude}`;
  return [site.address, site.city, site.state].filter(Boolean).join(", ");
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; multipleSites?: string }>;
}) {
  const context = await requireTenant();
  const { q = "", multipleSites = "" } = await searchParams;
  const showMultipleSites = multipleSites === "1";

  const [customers, summary] = await Promise.all([
    listCustomers(context.businessId, q, showMultipleSites),
    getCustomerListSummary(context.businessId),
  ]);

  const mapLocation = mapQuery(customers);
  const mapUrl = mapLocation ? `https://www.google.com/maps?q=${encodeURIComponent(mapLocation)}&output=embed` : null;

  const rows = customers.map((customer) => ({
    id: customer.id,
    customerNumber: customer.customerNumber,
    name: customerName(customer),
    type: customer.type.replace("_", " "),
    isActive: customer.isActive,
    phone: customer.phone,
    email: customer.email,
    poc: customer.contacts[0] ? [customer.contacts[0].firstName, customer.contacts[0].lastName].filter(Boolean).join(" ") : null,
    siteCount: customer._count.sites,
    balance: customer.invoices.reduce((sum, invoice) => sum + Number(invoice.balanceDue), 0),
  }));

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-[1500px] px-3.5 py-5 lg:px-4 xl:px-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="jf-page-title">Customers</h1>
            <p className="jf-page-subtitle mt-1.5">Manage customers, service locations and relationship history.</p>
          </div>
          <Link href="/customers/new" className="inline-flex h-9 items-center justify-center gap-2 rounded-[9px] bg-[var(--primary)] px-3.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-95">
            <Plus size={15} strokeWidth={2.2} />
            New Customer
          </Link>
        </header>

        <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Clients", value: summary.totalClients, icon: Building2 },
            { label: "Total Sites", value: summary.totalSites, icon: MapPinned },
            { label: "Active Contracts", value: summary.activeContracts, icon: FileCheck2 },
            { label: "Due This Month", value: money(summary.dueThisMonth), icon: CalendarClock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">{label}</p>
                  <p className="mt-1.5 text-[24px] font-extrabold leading-[1.15] tracking-[-0.03em]">{value}</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Icon size={17} strokeWidth={1.9} />
                </span>
              </div>
            </div>
          ))}
        </section>

        <CustomerDirectory customers={rows} query={q} multipleSites={showMultipleSites} mapUrl={mapUrl} />
      </div>
    </main>
  );
}
