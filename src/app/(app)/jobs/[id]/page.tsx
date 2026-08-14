import Link from "next/link";
import { notFound } from "next/navigation";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { getExecutionJob, customerName } from "@/lib/jobs/persistence";
import { JobStatusControl } from "../components/JobStatusControl";
import { JobExecutionPanel } from "../components/JobExecutionPanel";
import { ServiceReportButton } from "../components/ServiceReportButton";
import { getInvoiceForJob } from "@/lib/invoices/persistence";
import { createInvoiceFromJobAction } from "../../invoices/actions";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const context = await requireTenant();
  const { id } = await params;
  const job = await getExecutionJob(context.businessId, id);
  if (!job) notFound();
  const invoice = await getInvoiceForJob(context.businessId, id);
  const price = job.totalAmount?.toString() ?? job.price?.toString() ?? "—";

  return (
    <main className="p-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/jobs" className="text-sm font-medium text-blue-600">← Jobs</Link>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-sm text-gray-400">{job.jobNumber}</p>
            <h1 className="mt-1 text-3xl font-bold">{job.title || job.service.name}</h1>
            <p className="mt-2 text-gray-500">{customerName(job.customer)} · {job.site?.name ?? "No site"}</p>
          </div>
          <JobStatusControl jobId={job.id} current={job.status} />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="font-semibold">Job details</h2>
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <div><dt className="text-xs uppercase text-gray-400">Customer</dt><dd className="mt-1 font-medium">{customerName(job.customer)}</dd></div>
              <div><dt className="text-xs uppercase text-gray-400">Service</dt><dd className="mt-1 font-medium">{job.service.name}</dd></div>
              <div><dt className="text-xs uppercase text-gray-400">Site</dt><dd className="mt-1 font-medium">{job.site?.name ?? "No site"}</dd></div>
              <div><dt className="text-xs uppercase text-gray-400">Priority</dt><dd className="mt-1 font-medium">{job.priority}</dd></div>
              <div><dt className="text-xs uppercase text-gray-400">Contract</dt><dd className="mt-1 font-medium">{job.contract ? `${job.contract.contractNumber} — ${job.contract.title}` : "No contract"}</dd></div>
              <div><dt className="text-xs uppercase text-gray-400">Scheduled start</dt><dd className="mt-1 font-medium">{job.scheduledStart ? new Date(job.scheduledStart).toLocaleString() : "—"}</dd></div>
              <div><dt className="text-xs uppercase text-gray-400">Scheduled end</dt><dd className="mt-1 font-medium">{job.scheduledEnd ? new Date(job.scheduledEnd).toLocaleString() : "—"}</dd></div>
              <div><dt className="text-xs uppercase text-gray-400">Price</dt><dd className="mt-1 font-medium">{price}</dd></div>
              <div><dt className="text-xs uppercase text-gray-400">Assigned staff</dt><dd className="mt-1 font-medium">{job.assignments.map((a) => `${a.staff.firstName} ${a.staff.lastName ?? ""}`).join(", ") || "Unassigned"}</dd></div>
            </dl>
            {job.description && <div className="mt-7 border-t pt-5"><h3 className="text-sm font-semibold">Description</h3><p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{job.description}</p></div>}
            {job.internalNotes && <div className="mt-5"><h3 className="text-sm font-semibold">Internal notes</h3><p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{job.internalNotes}</p></div>}
          </section>
          <aside className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold">Customer & site</h2>
            <p className="mt-4 font-medium">{customerName(job.customer)}</p>
            {job.customer.phone && <p className="mt-1 text-sm text-gray-500">{job.customer.phone}</p>}
            {job.customer.email && <p className="mt-1 text-sm text-gray-500">{job.customer.email}</p>}
            {job.site && <div className="mt-5 border-t pt-5">
              <p className="font-medium">{job.site.name}</p>
              <p className="mt-1 text-sm text-gray-500">{[job.site.address, job.site.city, job.site.state, job.site.postalCode].filter(Boolean).join(", ")}</p>
              {job.site.accessInstructions && <p className="mt-3 text-sm text-gray-600"><strong>Access:</strong> {job.site.accessInstructions}</p>}
            </div>}
          </aside>
        </div>

        {job.status === "COMPLETED" && (
          <div className="mt-6 flex justify-end">
            {invoice ? (
              <Link href={`/invoices/${invoice.id}`} className="rounded-lg border px-4 py-2.5 font-semibold">View {invoice.invoiceNumber}</Link>
            ) : (
              <form action={createInvoiceFromJobAction.bind(null, job.id)}><button className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white">Create Invoice</button></form>
            )}
          </div>
        )}

        {job.completion && (
          <div className="mt-6 flex justify-end">
            <ServiceReportButton jobId={job.id} hasReport={Boolean(job.completion.reports?.length)} />
          </div>
        )}

        <div className="mt-6">
          <JobExecutionPanel
            jobId={job.id}
            status={job.status}
            completion={job.completion}
          />
        </div>
      </div>
    </main>
  );
}
