import Link from "next/link";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { getDispatchBoard } from "@/lib/dispatch/persistence";
import { DispatchBoard } from "./DispatchBoard";

export default async function DispatchPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const context=await requireTenant();
  const params=await searchParams;
  const date=params.date ? new Date(`${params.date}T12:00:00`) : new Date();
  const {jobs,staff}=await getDispatchBoard(context.businessId,date);
  return <main className="p-8">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold text-blue-600">OPERATIONS</p><h1 className="mt-1 text-3xl font-bold">Dispatch</h1><p className="mt-2 text-gray-500">Assign technicians and manage today's field workload.</p></div>
        <Link href="/jobs/new" className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white">+ New Job</Link>
      </div>
      <form className="mt-6 flex gap-3" action="/dispatch"><input type="date" name="date" defaultValue={date.toISOString().slice(0,10)} className="rounded-lg border bg-white px-3 py-2.5"/><button className="rounded-lg border bg-white px-4 py-2.5 font-semibold">Load Day</button></form>
      <div className="mt-7"><DispatchBoard jobs={jobs.map(j=>({...j,scheduledStart:j.scheduledStart?.toISOString()??null,scheduledEnd:j.scheduledEnd?.toISOString()??null}))} staff={staff.map(s=>({id:s.id,firstName:s.firstName,lastName:s.lastName}))}/></div>
    </div>
  </main>;
}
