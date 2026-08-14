import Link from "next/link";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { listJobs, customerName } from "@/lib/jobs/persistence";

const statuses = ["ALL","NEW","SCHEDULED","ASSIGNED","DISPATCHED","EN_ROUTE","ON_SITE","IN_PROGRESS","PAUSED","COMPLETED","CANCELLED","RESCHEDULED","FAILED","INCOMPLETE"];

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const context = await requireTenant();
  const params = await searchParams;
  const q = params.q ?? "";
  const status = params.status ?? "ALL";
  const jobs = await listJobs(context.businessId, { q, status });

  return (
    <main className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-semibold text-blue-600">OPERATIONS</p><h1 className="mt-1 text-3xl font-bold">Jobs</h1><p className="mt-2 text-gray-500">Schedule, assign and track service work.</p></div>
          <Link href="/jobs/new" className="inline-flex rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white">+ New Job</Link>
        </div>
        <form className="mt-7 flex flex-col gap-3 sm:flex-row" action="/jobs">
          <input name="q" defaultValue={q} placeholder="Search job number, customer or title..." className="w-full rounded-lg border bg-white px-4 py-2.5" />
          <select name="status" defaultValue={status} className="rounded-lg border bg-white px-4 py-2.5">{statuses.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select>
          <button className="rounded-lg border bg-white px-4 py-2.5 font-medium">Filter</button>
        </form>
        <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="grid grid-cols-[120px_1.2fr_1fr_1fr_150px_130px] border-b bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"><span>Job</span><span>Customer</span><span>Site</span><span>Service</span><span>Schedule</span><span>Status</span></div>
          {jobs.length === 0 ? <div className="p-10 text-center text-gray-500">No jobs found. Create your first job to begin scheduling work.</div> : jobs.map((job) => {
            const staff = job.assignments[0]?.staff;
            return <Link key={job.id} href={`/jobs/${job.id}`} className="grid grid-cols-[120px_1.2fr_1fr_1fr_150px_130px] items-center border-b px-5 py-4 last:border-b-0 hover:bg-gray-50">
              <div className="font-mono text-sm font-semibold">{job.jobNumber}</div>
              <div><p className="font-semibold">{customerName(job.customer)}</p><p className="mt-1 text-xs text-gray-400">{staff ? `${staff.firstName} ${staff.lastName ?? ""}` : "Unassigned"}</p></div>
              <div className="text-sm text-gray-600">{job.site?.name ?? "No site"}</div><div className="text-sm text-gray-600">{job.service.name}</div>
              <div className="text-sm text-gray-600">{job.scheduledStart ? new Date(job.scheduledStart).toLocaleString() : "Unscheduled"}</div>
              <div><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold">{job.status.replaceAll("_", " ")}</span></div>
            </Link>;
          })}
        </div>
      </div>
    </main>
  );
}
