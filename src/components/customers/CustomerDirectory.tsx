"use client";

import Link from "next/link";
import {
  Search,
  Building2,
  MapPinned,
  Mail,
  Phone,
  UserRound,
  Map,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

type CustomerRow = {
  id: string;
  customerNumber: string;
  name: string;
  type: string;
  isActive: boolean;
  phone: string | null;
  email: string | null;
  poc: string | null;
  siteCount: number;
  balance: number;
};

type Props = {
  customers: CustomerRow[];
  query: string;
  multipleSites: boolean;
  mapUrl: string | null;
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CustomerDirectory({
  customers,
  query,
  multipleSites,
  mapUrl,
}: Props) {
  const [showMap, setShowMap] = useState(false);

  return (
    <section className="mt-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      {/* Dedicated search / action toolbar — deliberately outside the content table. */}
      <form
        action="/customers"
        className="flex flex-col gap-2.5 border-b border-[var(--border)] p-3.5 lg:flex-row lg:items-center"
      >
        <div className="relative min-w-0 flex-1">
          <Search
            size={15}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search by CID, customer, email or phone..."
            aria-label="Search customers"
            className="h-9 w-full rounded-[9px] border border-[var(--border)] bg-[var(--surface-subtle)] pl-9 pr-3 text-xs outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--primary)]/10"
          />
        </div>

        {multipleSites ? <input type="hidden" name="multipleSites" value="1" /> : null}

        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[9px] bg-[var(--primary)] px-4 text-xs font-semibold text-white transition hover:brightness-95"
        >
          <Search size={14} />
          Search
        </button>

        <label className="inline-flex h-9 cursor-pointer items-center gap-2 px-1 text-xs font-semibold text-[var(--text)]">
          <input
            type="checkbox"
            name="multipleSites"
            value="1"
            defaultChecked={multipleSites}
            className="h-3.5 w-3.5 accent-[var(--primary)]"
          />
          Multiple Sites
        </label>

        <label className="inline-flex h-9 cursor-pointer items-center gap-2 px-1 text-xs font-semibold text-[var(--text)]">
          <button
            type="button"
            role="switch"
            aria-checked={showMap}
            aria-label="Toggle Google Maps"
            onClick={() => setShowMap((current) => !current)}
            className={`relative h-4 w-7 rounded-full transition ${
              showMap ? "bg-[var(--primary)]" : "bg-[var(--border)]"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition ${
                showMap ? "translate-x-3" : ""
              }`}
            />
          </button>
          <Map size={13} className="text-[var(--muted)]" />
          Google Maps
        </label>

        <Link
          href="/customers"
          className="inline-flex h-9 items-center justify-center gap-1.5 px-1 text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--primary)]"
        >
          <X size={14} />
          Clear
        </Link>
      </form>

      {/* One content viewport: either table OR map, never both. */}
      {showMap ? (
        <div className="relative h-[520px] w-full bg-[var(--surface-subtle)]">
          {mapUrl ? (
            <iframe
              title="Customer service locations map"
              src={mapUrl}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="grid h-full place-items-center px-5 text-center">
              <div>
                <MapPinned size={26} className="mx-auto text-[var(--muted)]" />
                <p className="mt-2 text-sm font-semibold">No mapped service locations yet</p>
                <p className="mt-1 max-w-md text-xs text-[var(--muted)]">
                  Add an address or coordinates to a site to display its location on Google Maps.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="hidden min-w-[1100px] grid-cols-[90px_1.45fr_100px_90px_1.1fr_1fr_1.3fr_120px_110px] border-b border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] xl:grid">
            <span>CID</span>
            <span>Customer</span>
            <span>Status</span>
            <span>Sites</span>
            <span>Contact</span>
            <span>POC</span>
            <span>Email</span>
            <span className="text-right">Balance</span>
            <span className="text-right">Action</span>
          </div>

          {customers.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                <Building2 size={18} strokeWidth={1.8} />
              </div>
              <p className="mt-3 text-sm font-semibold">No customers found</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Try clearing your filters or create a new customer.
              </p>
              <Link
                href="/customers/new"
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-[9px] bg-[var(--primary)] px-3.5 text-xs font-semibold text-white"
              >
                <Building2 size={14} />
                New Customer
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="grid min-w-[1100px] grid-cols-[90px_1.45fr_100px_90px_1.1fr_1fr_1.3fr_120px_110px] items-center gap-0 border-b border-[var(--border)] px-4 py-3 transition last:border-b-0 hover:bg-[var(--surface-hover)]"
                >
                  <Link
                    href={`/customers/${customer.id}`}
                    className="font-mono text-[10px] font-semibold text-[var(--primary)]"
                  >
                    {customer.customerNumber}
                  </Link>

                  <div className="min-w-0 pr-3">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="block truncate text-xs font-semibold text-[var(--text)] hover:text-[var(--primary)]"
                    >
                      {customer.name}
                    </Link>
                    <span className="mt-0.5 block truncate text-[10px] text-[var(--muted)]">
                      {customer.type}
                    </span>
                  </div>

                  <span
                    className={`inline-flex w-fit items-center rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.04em] ${
                      customer.isActive
                        ? "bg-[var(--success-soft)] text-[var(--success)]"
                        : "bg-[var(--danger-soft)] text-[var(--danger)]"
                    }`}
                  >
                    {customer.isActive ? "Active" : "Inactive"}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                    <MapPinned size={13} className="text-[var(--muted)]" />
                    {customer.siteCount}
                  </span>

                  <div className="min-w-0 pr-3 text-[11px] text-[var(--muted)]">
                    {customer.phone ? (
                      <p className="flex truncate items-center gap-1.5">
                        <Phone size={12} className="shrink-0" />
                        {customer.phone}
                      </p>
                    ) : (
                      <span>—</span>
                    )}
                  </div>

                  <div className="min-w-0 pr-3 text-[11px]">
                    {customer.poc ? (
                      <div className="flex min-w-0 items-center gap-1.5">
                        <UserRound size={12} className="shrink-0 text-[var(--muted)]" />
                        <span className="truncate">{customer.poc}</span>
                      </div>
                    ) : (
                      <span className="text-[var(--muted)]">—</span>
                    )}
                  </div>

                  <div className="min-w-0 pr-3 text-[11px] text-[var(--muted)]">
                    {customer.email ? (
                      <p className="flex truncate items-center gap-1.5">
                        <Mail size={12} className="shrink-0" />
                        {customer.email}
                      </p>
                    ) : (
                      <span>—</span>
                    )}
                  </div>

                  <div
                    className={`text-right text-xs font-bold ${
                      customer.balance > 0
                        ? "text-[var(--danger)]"
                        : "text-[var(--success)]"
                    }`}
                  >
                    {money(customer.balance)}
                  </div>

                  <div className="flex items-center justify-end">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="inline-flex h-7 items-center gap-1 rounded-[7px] px-2 text-[10px] font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-soft)]"
                    >
                      View
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2.5 text-[10px] text-[var(--muted)]">
            <span>
              {customers.length} customer{customers.length === 1 ? "" : "s"}
            </span>
            {multipleSites ? (
              <span>Showing customers with multiple sites</span>
            ) : query ? (
              <span>Filtered by “{query}”</span>
            ) : (
              <span>All customers</span>
            )}
          </div>
        </>
      )}
    </section>
  );
}
