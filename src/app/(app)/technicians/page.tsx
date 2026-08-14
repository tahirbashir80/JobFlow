import Link from "next/link";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { listTechnicians } from "@/lib/technicians/persistence";

export default async function TechniciansPage() {
  const context = await requireTenant();
  const technicians = await listTechnicians(context.businessId);

  return <main className="p-8"><div className="mx-auto max-w-7xl">
    <div><p className="text-sm font-semibold text-blue-600">PEOPLE</p><h1 className="mt-1 text-3xl font-bold">Technicians</h1><p className="mt-2 text-gray-500">Manage field staff, skills, availability and workload.</p></div>
    <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {technicians.map(t => {
        const activeJobs=t.assignments.filter(a=>["ASSIGNED","ACCEPTED","EN_ROUTE","ON_SITE","IN_PROGRESS"].includes(a.status)).length;
        return <Link key={t.id} href={`/technicians/${t.id}`} className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between"><div><div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">{t.firstName[0]}{t.lastName?.[0]||""}</div><h2 className="mt-4 font-bold">{t.firstName} {t.lastName||""}</h2><p className="text-sm text-gray-500">{t.roleTitle||"Technician"}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${t.status==="ACTIVE"?"bg-green-50 text-green-700":"bg-gray-100 text-gray-600"}`}>{t.status}</span></div>
          <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-400">Active jobs</p><p className="mt-1 text-xl font-bold">{activeJobs}</p></div><div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-400">Skills</p><p className="mt-1 text-xl font-bold">{t.skills.length}</p></div></div>
          <div className="mt-4"><p className="text-xs font-semibold uppercase text-gray-400">Services</p><p className="mt-1 line-clamp-2 text-sm text-gray-600">{t.skills.map(s=>s.service.name).join(", ")||"No services assigned"}</p></div>
        </Link>
      })}
      {!technicians.length && <div className="rounded-2xl border border-dashed p-10 text-center text-gray-500 md:col-span-2 xl:col-span-3">No technicians found. Add staff during onboarding to begin dispatching work.</div>}
    </div>
  </div></main>;
}
