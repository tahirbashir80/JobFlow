"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  CircleDollarSign,
  ClipboardPenLine,
  FileSignature,
  FileText,
  Info,
  MapPin,
  RefreshCw,
  Save,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { createContractAction, updateContractAction } from "./actions";

type Option = { id: string; name: string };
type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
};
type Site = { id: string; customerId: string; name: string };

export type ContractFormInitial = {
  id?: string;
  customerId: string;
  siteId?: string | null;
  serviceId?: string | null;
  title: string;
  status: string;
  billingCycle: string;
  contractValue: number | null;
  startDate: string;
  endDate: string;
  renewalDate: string;
  autoRenew: boolean;
  notes: string;
};

const statuses = [
  ["DRAFT", "Draft"],
  ["ACTIVE", "Active"],
  ["EXPIRED", "Expired"],
  ["CANCELLED", "Cancelled"],
];

const cycles = [
  ["ONE_TIME", "One time"],
  ["MONTHLY", "Monthly"],
  ["QUARTERLY", "Quarterly"],
  ["SEMI_ANNUAL", "Every 6 months"],
  ["ANNUAL", "Annual"],
];

const customerLabel = (c: Customer) =>
  c.companyName ||
  [c.firstName, c.lastName].filter(Boolean).join(" ") ||
  "Unnamed customer";

const controlClass =
  "mt-2 h-11 w-full rounded-[9px] border border-[var(--border)] bg-[var(--form-background)] px-3 text-sm font-medium text-[var(--foreground)] shadow-none outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--primary)_12%,transparent)]";

const sectionClass =
  "overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_3px_rgba(23,50,77,.035)]";

function SectionHeader({
  icon: Icon,
  title,
  description,
  tone = "primary",
}: {
  icon: typeof FileText;
  title: string;
  description?: string;
  tone?: "primary" | "blue" | "success";
}) {
  const toneClass =
    tone === "blue"
      ? "bg-[var(--info-soft)] text-[var(--info)]"
      : tone === "success"
        ? "bg-[var(--success-soft)] text-[var(--success)]"
        : "bg-[var(--primary-soft)] text-[var(--primary)]";

  return (
    <div className="flex items-center gap-3">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[11px] ${toneClass}`}>
        <Icon size={20} strokeWidth={2} />
      </span>
      <div>
        <h2 className="text-[17px] font-750 tracking-[-.015em] text-[var(--foreground)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-[12px] leading-5 text-[var(--muted)]">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  optional = false,
}: {
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <span className="text-[12px] font-700 leading-5 text-[var(--foreground)]">
      {children}
      {optional ? (
        <span className="ml-1.5 font-500 text-[var(--muted)]">optional</span>
      ) : (
        <span className="ml-1 text-[var(--danger)]">*</span>
      )}
    </span>
  );
}

export function ContractForm({
  customers,
  sites,
  services,
  initial,
}: {
  customers: Customer[];
  sites: Site[];
  services: Option[];
  initial?: ContractFormInitial;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [customerId, setCustomerId] = useState(initial?.customerId || "");
  const [siteId, setSiteId] = useState(initial?.siteId || "");
  const [serviceId, setServiceId] = useState(initial?.serviceId || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [status, setStatus] = useState(initial?.status || "DRAFT");
  const [billingCycle, setBillingCycle] = useState(initial?.billingCycle || "ANNUAL");
  const [contractValue, setContractValue] = useState(
    initial?.contractValue == null ? "" : String(initial.contractValue),
  );
  const [startDate, setStartDate] = useState(
    initial?.startDate || new Date().toISOString().slice(0, 10),
  );
  const [endDate, setEndDate] = useState(initial?.endDate || "");
  const [renewalDate, setRenewalDate] = useState(initial?.renewalDate || "");
  const [autoRenew, setAutoRenew] = useState(initial?.autoRenew || false);
  const [notes, setNotes] = useState(initial?.notes || "");

  const customerSites = sites.filter((site) => site.customerId === customerId);

  function submit() {
    setMessage("");

    const input = {
      customerId,
      siteId: siteId || undefined,
      serviceId: serviceId || undefined,
      title,
      status: status as any,
      billingCycle: billingCycle as any,
      contractValue: contractValue ? Number(contractValue) : undefined,
      startDate,
      endDate: endDate || undefined,
      renewalDate: renewalDate || undefined,
      autoRenew,
      notes,
    };

    startTransition(async () => {
      try {
        if (initial?.id) {
          await updateContractAction(initial.id, input);
          setMessage("Contract saved successfully.");
        } else {
          await createContractAction(input);
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to save contract.");
      }
    });
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center gap-2 text-[12px] font-600 text-[var(--muted)]">
        <Link
          href="/contracts"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--primary)]"
        >
          <ArrowLeft size={14} />
          Contracts
        </Link>
        <span className="text-[var(--border)]">/</span>
        <span>{initial?.id ? "Edit Contract" : "New Contract"}</span>
      </div>

      {message ? (
        <div className="rounded-[10px] border border-[var(--border)] bg-[var(--primary-soft)] px-4 py-3 text-sm font-700 text-[var(--primary)]">
          {message}
        </div>
      ) : null}

      {/* Page introduction — deliberately follows the inspiration's visual hierarchy,
          while using JobFlow's existing typography, spacing and color tokens. */}
      <div className="relative overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface)] px-5 py-6 shadow-[0_1px_3px_rgba(23,50,77,.035)] sm:px-7 sm:py-7">
        <div className="relative z-10 flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[14px] bg-[var(--primary)] text-white shadow-sm">
            <FileSignature size={28} strokeWidth={1.9} />
          </span>
          <div>
            <p className="jf-eyebrow">{initial?.id ? "Contract Management" : "Agreement Setup"}</p>
            <h1 className="mt-1 text-[28px] font-800 leading-[1.15] tracking-[-.035em] text-[var(--foreground)] sm:text-[30px]">
              {initial?.id ? "Edit Contract" : "Create New Contract"}
            </h1>
            <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[var(--muted)]">
              Define the customer agreement, coverage period and commercial terms.
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-12 hidden h-40 w-72 opacity-60 sm:block">
          <div className="absolute right-8 top-7 h-24 w-24 rounded-full bg-[var(--primary-soft)]" />
          <div className="absolute right-20 top-16 h-20 w-20 rounded-full bg-[var(--info-soft)]" />
          <div className="absolute right-1 top-10 h-20 w-20 rounded-full border-[18px] border-[var(--primary-soft)]" />
          <div className="absolute right-20 top-12 h-16 w-24 rounded-[8px] border border-[var(--primary)] bg-[var(--surface)] shadow-sm">
            <div className="mx-3 mt-4 h-1.5 w-12 rounded-full bg-[var(--primary)]" />
            <div className="mx-3 mt-2 h-1.5 w-16 rounded-full bg-[var(--primary-soft)]" />
            <div className="mx-3 mt-2 h-1.5 w-10 rounded-full bg-[var(--primary-soft)]" />
          </div>
        </div>
      </div>

      {/* Agreement Information */}
      <section className={sectionClass}>
        <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
          <SectionHeader
            icon={ClipboardPenLine}
            title="Agreement Information"
            description="Select the customer and define what the agreement covers."
          />
        </div>

        <div className="grid gap-x-8 gap-y-5 p-5 sm:p-6 md:grid-cols-2">
          <label>
            <FieldLabel>Customer</FieldLabel>
            <div className="relative">
              <Building2
                size={17}
                className="pointer-events-none absolute left-3 top-[14px] text-[var(--primary)]"
              />
              <select
                value={customerId}
                onChange={(event) => {
                  setCustomerId(event.target.value);
                  setSiteId("");
                }}
                className={`${controlClass} pl-10`}
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customerLabel(customer)}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label>
            <FieldLabel>Contract title</FieldLabel>
            <div className="relative">
              <FileText
                size={17}
                className="pointer-events-none absolute right-3 top-[14px] text-[var(--muted)]"
              />
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Annual pest control agreement"
                className={`${controlClass} pr-10`}
              />
            </div>
          </label>

          <label>
            <FieldLabel optional>Site</FieldLabel>
            <div className="relative">
              <MapPin
                size={17}
                className="pointer-events-none absolute left-3 top-[14px] text-[var(--primary)]"
              />
              <select
                value={siteId}
                onChange={(event) => setSiteId(event.target.value)}
                className={`${controlClass} pl-10`}
              >
                <option value="">All customer sites</option>
                {customerSites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label>
            <FieldLabel optional>Service</FieldLabel>
            <div className="relative">
              <Wrench
                size={17}
                className="pointer-events-none absolute left-3 top-[14px] text-[var(--primary)]"
              />
              <select
                value={serviceId}
                onChange={(event) => setServiceId(event.target.value)}
                className={`${controlClass} pl-10`}
              >
                <option value="">Select service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>
      </section>

      {/* Status + value/date split */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className={sectionClass}>
          <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
            <SectionHeader
              icon={ShieldCheck}
              title="Contract Status & Terms"
              tone="blue"
            />
          </div>

          <div className="grid gap-5 p-5 sm:p-6">
            <label>
              <FieldLabel>Status</FieldLabel>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={controlClass}
              >
                {statuses.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <FieldLabel>Billing cycle</FieldLabel>
              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-[14px] text-[var(--primary)]"
                />
                <select
                  value={billingCycle}
                  onChange={(event) => setBillingCycle(event.target.value)}
                  className={`${controlClass} pl-10`}
                >
                  {cycles.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
            <SectionHeader
              icon={CalendarDays}
              title="Contract Value & Dates"
              tone="success"
            />
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <label>
              <FieldLabel optional>Contract value</FieldLabel>
              <div className="relative">
                <CircleDollarSign
                  size={17}
                  className="pointer-events-none absolute left-3 top-[14px] text-[var(--primary)]"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={contractValue}
                  onChange={(event) => setContractValue(event.target.value)}
                  placeholder="0.00"
                  className={`${controlClass} pl-10`}
                />
              </div>
            </label>

            <label>
              <FieldLabel>Start date</FieldLabel>
              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-[14px] text-[var(--primary)]"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className={`${controlClass} pl-10`}
                />
              </div>
            </label>

            <label>
              <FieldLabel optional>End date</FieldLabel>
              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-[14px] text-[var(--primary)]"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className={`${controlClass} pl-10`}
                />
              </div>
            </label>

            <label>
              <FieldLabel optional>Renewal date</FieldLabel>
              <div className="relative">
                <RefreshCw
                  size={17}
                  className="pointer-events-none absolute left-3 top-[14px] text-[var(--primary)]"
                />
                <input
                  type="date"
                  value={renewalDate}
                  onChange={(event) => setRenewalDate(event.target.value)}
                  className={`${controlClass} pl-10`}
                />
              </div>
            </label>
          </div>
        </section>
      </div>

      {/* Auto renewal */}
      <section className={`${sectionClass} px-5 py-5 sm:px-6 sm:py-6`}>
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-[11px] bg-[var(--success-soft)] text-[var(--success)]">
            <RefreshCw size={20} />
          </span>
          <div>
            <h2 className="text-[17px] font-750 tracking-[-.015em]">Auto Renewal</h2>
            <p className="mt-0.5 text-[12px] text-[var(--muted)]">
              Automatically flag this contract for renewal when its term approaches.
            </p>
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-3 text-[13px] font-700">
          <input
            type="checkbox"
            checked={autoRenew}
            onChange={(event) => setAutoRenew(event.target.checked)}
            className="h-5 w-5 accent-[var(--primary)]"
          />
          <span>Auto-renew contract</span>
          <span
            title="The contract remains eligible for renewal according to its renewal date."
            className="grid h-5 w-5 place-items-center rounded-full bg-[var(--surface-subtle)] text-[var(--muted)]"
          >
            <Info size={13} />
          </span>
        </label>
      </section>

      {/* Notes */}
      <section className={sectionClass}>
        <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
          <SectionHeader
            icon={FileText}
            title="Additional Notes"
            description="Capture scope, exclusions or special commercial terms."
          />
        </div>
        <div className="p-5 sm:p-6">
          <div className="relative">
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value.slice(0, 500))}
              maxLength={500}
              rows={4}
              placeholder="Contract notes, scope or special terms"
              className={`${controlClass} min-h-[116px] resize-y py-3`}
            />
            <span className="pointer-events-none absolute bottom-2.5 right-3 text-[11px] font-600 text-[var(--muted)]">
              {notes.length}/500
            </span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-5">
        <Link
          href="/contracts"
          className="inline-flex h-11 items-center justify-center rounded-[9px] border border-[var(--border)] bg-[var(--surface)] px-5 text-[13px] font-700 text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          Cancel
        </Link>

        <button
          disabled={pending || !customerId || !title.trim()}
          onClick={submit}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[9px] bg-[var(--primary)] px-5 text-[13px] font-800 text-white shadow-sm hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <Save size={16} />
          )}
          {initial?.id ? "Save Contract" : "Save Contract"}
        </button>
      </div>
    </div>
  );
}
