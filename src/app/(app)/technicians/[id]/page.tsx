import Link from "next/link";
import { notFound } from "next/navigation";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { getTechnician, listBusinessServices, listTechnicianUserOptions } from "@/lib/technicians/persistence";
import { TechnicianManager } from "./TechnicianManager";

export default async function TechnicianDetail({ params }: { params: Promise<{ id:string }> }) {
  const context=await requireTenant();
  const {id}=await params;
  const [technician,services,users]=await Promise.all([getTechnician(context.businessId,id),listBusinessServices(context.businessId),listTechnicianUserOptions(context.businessId,id)]);
  if(!technician) notFound();
  const active=technician.assignments.filter(a=>["ASSIGNED","ACCEPTED","EN_ROUTE","ON_SITE","IN_PROGRESS"].includes(a.status));
  return <main className="p-8"><div className="mx-auto max-w-6xl">
    <Link href="/technicians" className="text-sm font-medium text-blue-600">← Technicians</Link>
    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-semibold text-blue-600">TECHNICIAN</p><h1 className="mt-1 text-3xl font-bold">{technician.firstName} {technician.lastName||""}</h1><p className="mt-2 text-gray-500">{technician.roleTitle||"Field Technician"} · {technician.phone||technician.email||"No contact information"}</p></div><span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">{technician.status}</span></div>
    <div className="mt-7 grid gap-5 md:grid-cols-3"><div className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-xs uppercase text-gray-400">Active jobs</p><p className="mt-1 text-3xl font-bold">{active.length}</p></div><div className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-xs uppercase text-gray-400">Services</p><p className="mt-1 text-3xl font-bold">{technician.skills.length}</p></div><div className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-xs uppercase text-gray-400">Jobs in history</p><p className="mt-1 text-3xl font-bold">{technician.assignments.length}</p></div></div>
    <div className="mt-6"><TechnicianManager technician={technician} services={services} users={users}/></div>
    <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm"><h2 className="font-semibold">Recent jobs</h2><div className="mt-4 divide-y">{technician.assignments.map(a=><Link key={a.id} href={`/jobs/${a.job.id}`} className="flex items-center justify-between gap-4 py-4"><div><p className="font-mono text-xs text-gray-400">{a.job.jobNumber}</p><p className="mt-1 font-medium">{a.job.service.name} · {a.job.customer.companyName || [a.job.customer.firstName,a.job.customer.lastName].filter(Boolean).join(" ")}</p></div><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold">{a.status.replaceAll("_"," ")}</span></Link>)}</div></section>
  </div></main>;
}
