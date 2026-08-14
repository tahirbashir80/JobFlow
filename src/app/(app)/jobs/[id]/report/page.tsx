import Link from "next/link";
import { notFound } from "next/navigation";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { getServiceReport } from "@/lib/jobs/persistence";
import { PrintReportButton } from "./PrintReportButton";

export default async function ServiceReportPage({ params }: { params: Promise<{ id: string }> }) {
  const context = await requireTenant();
  const { id } = await params;
  const report = await getServiceReport(context.businessId, id);
  if (!report) notFound();

  const completion = report.completion;
  const job = completion.job;
  const customer = job.customer;
  const business = job.business;
  const technician = job.assignments[0]?.staff;
  const customerName = customer.companyName?.trim() || [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim() || "Customer";
  const address = [job.site?.address, job.site?.city, job.site?.state, job.site?.postalCode].filter(Boolean).join(", ");

  return (
    <main className="min-h-screen bg-gray-100 p-6 print:bg-white print:p-0">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex items-center justify-between print:hidden">
          <Link href={`/jobs/${job.id}`} className="text-sm font-medium text-blue-600">← Back to Job</Link>
          <PrintReportButton />
        </div>

        <article className="bg-white p-10 shadow-sm print:shadow-none sm:p-14">
          <header className="flex flex-col gap-6 border-b pb-7 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Service Report</p>
              <h1 className="mt-2 text-3xl font-bold">{business.name}</h1>
              <p className="mt-2 text-sm text-gray-500">{[business.address, business.city, business.state, business.postalCode].filter(Boolean).join(", ")}</p>
              <p className="text-sm text-gray-500">{[business.phone, business.email, business.website].filter(Boolean).join(" · ")}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-mono text-sm font-semibold">{report.reportNumber}</p>
              <p className="mt-2 text-sm text-gray-500">Job {job.jobNumber}</p>
              <p className="mt-1 text-sm text-gray-500">{new Date(completion.completedAt).toLocaleDateString()}</p>
            </div>
          </header>

          <section className="mt-8 grid gap-7 sm:grid-cols-2">
            <div><h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Customer</h2><p className="mt-2 font-semibold">{customerName}</p>{customer.phone && <p className="text-sm text-gray-500">{customer.phone}</p>}{customer.email && <p className="text-sm text-gray-500">{customer.email}</p>}</div>
            <div><h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Service Location</h2><p className="mt-2 font-semibold">{job.site?.name ?? "—"}</p><p className="text-sm text-gray-500">{address || "Address not provided"}</p></div>
            <div><h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Service</h2><p className="mt-2 font-semibold">{job.service.name}</p>{job.title && <p className="text-sm text-gray-500">{job.title}</p>}</div>
            <div><h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Technician</h2><p className="mt-2 font-semibold">{technician ? `${technician.firstName} ${technician.lastName ?? ""}` : "—"}</p>{technician?.roleTitle && <p className="text-sm text-gray-500">{technician.roleTitle}</p>}</div>
          </section>

          <section className="mt-10 space-y-7">
            <div><h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Work Performed</h2><p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">{completion.workPerformed || "No work description provided."}</p></div>
            <div><h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Findings</h2><p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">{completion.findings || "No findings recorded."}</p></div>
            <div><h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Recommendations</h2><p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">{completion.recommendations || "No recommendations recorded."}</p></div>
            {completion.customerComments && <div><h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Customer Comments</h2><p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">{completion.customerComments}</p></div>}
          </section>

          <section className="mt-10 border-t pt-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-sm font-semibold">Customer acknowledgement</p><p className="mt-1 text-sm text-gray-500">{completion.customerApproved ? "Customer approved / acknowledged the completed work." : "No customer acknowledgement was recorded."}</p></div>
              <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${completion.customerApproved ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>{completion.customerApproved ? "ACKNOWLEDGED" : "NOT ACKNOWLEDGED"}</span>
            </div>
          </section>

          <footer className="mt-12 border-t pt-5 text-xs text-gray-400">
            Generated by JobFlow · Report status: {report.status}
          </footer>
        </article>
      </div>
    </main>
  );
}
