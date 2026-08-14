"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleDollarSign,
  FileText,
  UserPlus,
  ReceiptText,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";

type DashboardData = {
  businessName: string;
  currency: string;
  totalRevenue: number;
  jobsThisMonth: number;
  newCustomersThisMonth: number;
  outstandingInvoices: number;
  outstandingInvoiceCount: number;
  previousMonthRevenue: number;
  previousMonthJobs: number;
  previousMonthCustomers: number;
  recentJobs: {
    id: string;
    jobNumber: string;
    status: string;
    priority: string;
    createdAt: string;
    scheduledStart: string | null;
    service: string;
    customer: string;
    staff: string;
  }[];
  recentInvoices: {
    id: string;
    invoiceNumber: string;
    status: string;
    totalAmount: number;
    balanceDue: number;
    issueDate: string;
    customer: string;
  }[];
  revenueByService: { name: string; amount: number }[];
  jobsByStaff: { name: string; count: number }[];
  jobStatus: { status: string; count: number }[];
};

const statusClass: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SENT: "bg-blue-50 text-blue-700",
  PARTIALLY_PAID: "bg-amber-50 text-amber-700",
  PAID: "bg-emerald-50 text-emerald-700",
  OVERDUE: "bg-red-50 text-red-700",
  NEW: "bg-slate-100 text-slate-600",
  SCHEDULED: "bg-blue-50 text-blue-700",
  ASSIGNED: "bg-violet-50 text-violet-700",
  IN_PROGRESS: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${Math.round(value).toLocaleString()}`;
  }
}

function statusLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, char => char.toUpperCase());
}

function customerInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "C";
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function Card({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
        <h2 className="jf-section-title">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatusBadge({ value }: { value: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClass[value] ?? "bg-slate-100 text-slate-600"}`}>
      {statusLabel(value)}
    </span>
  );
}

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  changeLabel,
  tone = "positive",
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: typeof CircleDollarSign;
  changeLabel?: string;
  tone?: "positive" | "negative" | "neutral";
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="jf-metric-label">{label}</p>
          <p className="jf-metric-value">{value}</p>
          <div className={`mt-2 flex items-center gap-1.5 text-xs font-semibold ${
            tone === "negative" ? "text-[var(--danger)]" :
            tone === "positive" ? "text-[var(--success)]" :
            "text-[var(--muted)]"
          }`}>
            {tone === "negative" ? <TrendingDown size={14} strokeWidth={2.2} /> : tone === "positive" ? <TrendingUp size={14} strokeWidth={2.2} /> : <CheckCircle2 size={14} strokeWidth={2.2} />}
            <span>{changeLabel ?? helper}</span>
          </div>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <Icon size={17} strokeWidth={1.8} />
        </span>
      </div>
    </motion.div>
  );
}

function RevenueChart({ data, currency }: { data: DashboardData["revenueByService"]; currency: string }) {
  const max = Math.max(1, ...data.map(item => item.amount));
  return (
    <div className="space-y-4 p-5">
      {data.length ? data.map(item => (
        <div key={item.name}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
            <span className="truncate font-medium">{item.name}</span>
            <span className="shrink-0 font-semibold">{formatMoney(item.amount, currency)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.amount / max) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full bg-[var(--primary)]"
            />
          </div>
        </div>
      )) : <EmptyChart text="No service revenue data yet." />}
    </div>
  );
}

function StaffChart({ data }: { data: DashboardData["jobsByStaff"] }) {
  const max = Math.max(1, ...data.map(item => item.count));
  return (
    <div className="space-y-4 p-5">
      {data.length ? data.map(item => (
        <div key={item.name} className="flex items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--primary-soft)] text-[10px] font-bold text-[var(--primary)]">
            {customerInitials(item.name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="truncate font-medium">{item.name}</span>
              <span className="font-semibold">{item.count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.count / max) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-[var(--accent)]"
              />
            </div>
          </div>
        </div>
      )) : <EmptyChart text="No staff assignments yet." />}
    </div>
  );
}

function StatusChart({ data }: { data: DashboardData["jobStatus"] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const colors = ["var(--primary)", "var(--accent)", "#4C9A6A", "#D99A27", "#B23A2E", "#64748B"];
  let cursor = 0;
  const segments = data.map((item, index) => {
    const start = cursor;
    cursor += total ? (item.count / total) * 360 : 0;
    return `${colors[index % colors.length]} ${start}deg ${cursor}deg`;
  });

  return (
    <div className="flex min-h-[220px] items-center gap-6 p-5">
      {data.length ? (
        <>
          <div
            className="relative grid h-36 w-36 shrink-0 place-items-center rounded-full"
            style={{ background: `conic-gradient(${segments.join(", ")})` }}
          >
            <div className="grid h-24 w-24 place-items-center rounded-full bg-[var(--surface)]">
              <div className="text-center">
                <p className="text-2xl font-bold tracking-tight">{total}</p>
                <p className="text-[10px] text-[var(--muted)]">Total jobs</p>
              </div>
            </div>
          </div>
          <div className="min-w-0 space-y-2.5">
            {data.slice(0, 6).map((item, index) => (
              <div key={item.status} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: colors[index % colors.length] }} />
                <span className="truncate text-[var(--muted)]">{statusLabel(item.status)}</span>
                <span className="ml-auto font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </>
      ) : <EmptyChart text="No job status data yet." />}
    </div>
  );
}

function EmptyChart({ text }: { text: string }) {
  return <div className="grid min-h-[190px] place-items-center text-center text-xs text-[var(--muted)]">{text}</div>;
}

export default function CorporateDashboard({ data }: { data: DashboardData }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1500px] px-3.5 py-5 lg:px-4 xl:px-5">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="jf-page-title">{greeting()}</h1>
            <p className="jf-page-subtitle mt-1.5">
              Here&apos;s what&apos;s happening across {data.businessName} today.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dispatch" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-xs font-semibold text-white shadow-sm transition hover:brightness-95">
              <BriefcaseBusiness size={15} /> Dispatch
            </Link>
            <Link href="/jobs/new" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-xs font-semibold text-white shadow-sm transition hover:brightness-95">
              <ReceiptText size={15} /> New Job
            </Link>
          </div>
        </header>

        {/* Row 1: four executive KPI cards */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Revenue"
            value={formatMoney(data.totalRevenue, data.currency)}
            helper={`${data.currency} · completed jobs this month`}
            icon={CircleDollarSign}
            changeLabel={data.previousMonthRevenue === 0 ? "New this month" : `${((data.totalRevenue - data.previousMonthRevenue) / data.previousMonthRevenue * 100).toFixed(1)}% vs last month`}
            tone={data.totalRevenue >= data.previousMonthRevenue ? "positive" : "negative"}
          />
          <MetricCard
            label="Jobs This Month"
            value={data.jobsThisMonth}
            helper="Jobs created this month"
            icon={BriefcaseBusiness}
            changeLabel={data.previousMonthJobs === 0 ? "New this month" : `${((data.jobsThisMonth - data.previousMonthJobs) / data.previousMonthJobs * 100).toFixed(1)}% vs last month`}
            tone={data.jobsThisMonth >= data.previousMonthJobs ? "positive" : "negative"}
          />
          <MetricCard
            label="New Customer"
            value={data.newCustomersThisMonth}
            helper="Customers added this month"
            icon={UserPlus}
            changeLabel={data.previousMonthCustomers === 0 ? "New this month" : `${((data.newCustomersThisMonth - data.previousMonthCustomers) / data.previousMonthCustomers * 100).toFixed(1)}% vs last month`}
            tone={data.newCustomersThisMonth >= data.previousMonthCustomers ? "positive" : "negative"}
          />
          <MetricCard
            label="Outstanding Invoices"
            value={formatMoney(data.outstandingInvoices, data.currency)}
            helper={`${data.outstandingInvoiceCount} invoices with balance due`}
            icon={FileText}
            changeLabel={data.outstandingInvoices === 0 ? "No outstanding balance" : `${data.outstandingInvoiceCount} invoices require collection`}
            tone={data.outstandingInvoices === 0 ? "positive" : "negative"}
          />
        </div>

        {/* Row 2: two operational tables */}
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <Card title="Recent Jobs" action={<Link href="/jobs" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">View all <ArrowRight size={13} /></Link>}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-subtle)] text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                    <th className="px-4 py-2.5">Job</th>
                    <th className="px-2.5 py-2.5">Customer</th>
                    <th className="px-2.5 py-2.5">Staff</th>
                    <th className="px-2.5 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {data.recentJobs.slice(0, 4).map(job => (
                    <tr key={job.id} className="group transition hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-2.5">
                        <Link href={`/jobs/${job.id}`} className="text-xs font-semibold text-[var(--primary)]">{job.jobNumber}</Link>
                        <p className="mt-0.5 text-[10px] leading-tight text-[var(--muted)]">{job.service}</p>
                      </td>
                      <td className="max-w-[150px] truncate px-2.5 py-2.5 text-xs">{job.customer}</td>
                      <td className="max-w-[120px] truncate px-2.5 py-2.5 text-xs text-[var(--muted)]">{job.staff}</td>
                      <td className="px-2.5 py-2.5"><StatusBadge value={job.status} /></td>
                      <td className="px-4 py-2.5 text-right text-[10px] text-[var(--muted)]">{new Date(job.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data.recentJobs.length && <div className="px-5 py-12 text-center text-xs text-[var(--muted)]">No jobs yet.</div>}
            </div>
          </Card>

          <Card title="Recent Invoices" action={<Link href="/invoices" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">View all <ArrowRight size={13} /></Link>}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-0 table-fixed text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-subtle)] text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                    <th className="w-[20%] px-4 py-2.5">Invoice</th>
                    <th className="px-2.5 py-2.5">Customer</th>
                    <th className="w-[16%] px-2.5 py-2.5 text-right">Amount</th>
                    <th className="px-2.5 py-2.5">Status</th>
                    <th className="w-[14%] px-4 py-2.5 text-right">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {data.recentInvoices.slice(0, 4).map(invoice => (
                    <tr key={invoice.id} className="transition hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-2.5"><Link href={`/invoices/${invoice.id}`} className="text-xs font-semibold text-[var(--primary)]">{invoice.invoiceNumber}</Link></td>
                      <td className="max-w-[150px] truncate px-2.5 py-2.5 text-xs">{invoice.customer}</td>
                      <td className="px-2.5 py-2.5 text-right text-xs font-semibold">{formatMoney(invoice.totalAmount, data.currency)}</td>
                      <td className="px-2.5 py-2.5"><StatusBadge value={invoice.status} /></td>
                      <td className="px-4 py-2.5 text-right text-xs font-semibold">{formatMoney(invoice.balanceDue, data.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data.recentInvoices.length && <div className="px-5 py-12 text-center text-xs text-[var(--muted)]">No invoices yet.</div>}
            </div>
          </Card>
        </div>

        {/* Row 3: three analytical graph cards */}
        <div className="mt-3 grid gap-3 xl:grid-cols-3">
          <Card title="Revenue by Service" action={<span className="text-[10px] text-[var(--muted)]">This month</span>}>
            <RevenueChart data={data.revenueByService} currency={data.currency} />
          </Card>
          <Card title="Jobs by Staff" action={<span className="text-[10px] text-[var(--muted)]">This month</span>}>
            <StaffChart data={data.jobsByStaff} />
          </Card>
          <Card title="Job Status" action={<span className="text-[10px] text-[var(--muted)]">All jobs</span>}>
            <StatusChart data={data.jobStatus} />
          </Card>
        </div>
      </div>
    </div>
  );
}
