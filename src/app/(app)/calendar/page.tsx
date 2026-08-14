import Link from "next/link";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { getWeeklyCalendar } from "@/lib/dispatch/persistence";

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const context=await requireTenant();
  const params=await searchParams;
  const base=params.date ? new Date(`${params.date}T12:00:00`) : new Date();
  const jobs=await getWeeklyCalendar(context.businessId,base);
  const days=Array.from({length:7},(_,i)=>{const d=new Date(base);d.setDate(d.getDate()-d.getDay()+i);return d;});
  return <main className="p-8"><div className="mx-auto max-w-7xl">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-blue-600">SCHEDULING</p><h1 className="mt-1 text-3xl font-bold">Calendar</h1><p className="mt-2 text-gray-500">Weekly view of scheduled work.</p></div><Link href="/dispatch" className="rounded-lg border bg-white px-4 py-2.5 font-semibold">Open Dispatch</Link></div>
    <div className="mt-7 overflow-x-auto rounded-2xl border bg-white shadow-sm"><div className="grid min-w-[980px] grid-cols-7 divide-x">{days.map(d=><div key={d.toISOString()} className="min-h-[560px]"><div className="border-b bg-gray-50 p-4"><p className="text-xs font-semibold uppercase text-gray-400">{d.toLocaleDateString(undefined,{weekday:"short"})}</p><p className="mt-1 text-xl font-bold">{d.getDate()}</p></div><div className="space-y-3 p-3">{jobs.filter(j=>j.scheduledStart && new Date(j.scheduledStart).toDateString()===d.toDateString()).map(j=><Link key={j.id} href={`/jobs/${j.id}`} className="block rounded-xl border bg-blue-50 p-3 hover:bg-blue-100"><p className="font-mono text-[11px] text-gray-400">{j.jobNumber}</p><p className="mt-1 text-sm font-semibold">{j.service.name}</p><p className="mt-1 text-xs text-gray-500">{new Date(j.scheduledStart!).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</p><p className="mt-2 text-xs font-medium">{j.assignments[0]?`${j.assignments[0].staff.firstName} ${j.assignments[0].staff.lastName||""}`:"Unassigned"}</p></Link>)}</div></div>)}</div></div>
  </div></main>;
}
