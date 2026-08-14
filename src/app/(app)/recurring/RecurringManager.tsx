"use client";

import { useState, useTransition } from "react";
import { createRecurringServiceAction, toggleRecurringServiceAction, generateDueRecurringJobsAction } from "../jobs/actions";

const frequencies = [
  ["DAILY","Daily"],["WEEKLY","Weekly"],["BIWEEKLY","Every 2 weeks"],["MONTHLY","Monthly"],
  ["QUARTERLY","Quarterly"],["SEMI_ANNUAL","Every 6 months"],["ANNUAL","Annual"],["CUSTOM","Custom"],
] as const;

export type RecurringRow = {
  id: string;
  name: string;
  recurrenceType: string;
  intervalValue: number;
  nextRunAt: string;
  price: number | null;
  isActive: boolean;
  customer: { id: string; firstName: string | null; lastName: string | null; companyName: string | null };
  service: { id: string; name: string };
};

type CustomerOption = { id: string; firstName: string | null; lastName: string | null; companyName: string | null };
type ServiceOption = { id: string; name: string };

export function RecurringManager({ initial, customers, services }: { initial: RecurringRow[]; customers: CustomerOption[]; services: ServiceOption[] }) {
  const [pending,startTransition]=useTransition();
  const [message,setMessage]=useState("");
  const [customerId,setCustomerId]=useState("");
  const [serviceId,setServiceId]=useState("");
  const [name,setName]=useState("");
  const [frequency,setFrequency]=useState<any>("MONTHLY");
  const [interval,setInterval]=useState("1");
  const [startDate,setStartDate]=useState(new Date().toISOString().slice(0,10));
  const [endDate,setEndDate]=useState("");
  const [price,setPrice]=useState("");

  function create() {
    setMessage("");
    startTransition(async()=>{try {
      await createRecurringServiceAction({customerId,serviceId,name,recurrenceType:frequency,intervalValue:Number(interval),startDate,endDate:endDate||undefined,price:price?Number(price):undefined});
      setMessage("Recurring service created.");
      setName(""); setCustomerId(""); setServiceId("");
    } catch(e){setMessage(e instanceof Error?e.message:"Unable to create recurring service.");}});
  }
  function generate() {
    setMessage("");
    startTransition(async()=>{try{const n=await generateDueRecurringJobsAction();setMessage(`${n} recurring job${n===1?"":"s"} generated.`);}catch(e){setMessage(e instanceof Error?e.message:"Unable to generate jobs.");}});
  }
  return <div className="space-y-6">
    {message && <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">{message}</div>}
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="font-semibold">New recurring service</h2><p className="mt-1 text-sm text-gray-500">Create a schedule that generates real Jobs when due.</p></div><button onClick={generate} disabled={pending} className="rounded-lg border px-4 py-2.5 text-sm font-semibold">Generate due jobs</button></div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm font-medium">Customer<select value={customerId} onChange={e=>setCustomerId(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5"><option value="">Select customer</option>{customers.map(c=><option key={c.id} value={c.id}>{c.companyName||[c.firstName,c.lastName].filter(Boolean).join(" ")}</option>)}</select></label>
        <label className="text-sm font-medium">Service<select value={serviceId} onChange={e=>setServiceId(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5"><option value="">Select service</option>{services.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        <label className="text-sm font-medium">Schedule name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Quarterly termite service" className="mt-1 w-full rounded-lg border px-3 py-2.5"/></label>
        <label className="text-sm font-medium">Frequency<select value={frequency} onChange={e=>setFrequency(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5">{frequencies.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
        <label className="text-sm font-medium">Interval<input type="number" min="1" value={interval} onChange={e=>setInterval(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5"/></label>
        <label className="text-sm font-medium">Start date<input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5"/></label>
        <label className="text-sm font-medium">End date <span className="font-normal text-gray-400">optional</span><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5"/></label>
        <label className="text-sm font-medium">Price <span className="font-normal text-gray-400">optional</span><input type="number" min="0" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5"/></label>
      </div>
      <button disabled={pending||!customerId||!serviceId} onClick={create} className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50">Create recurring service</button>
    </section>

    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-6"><h2 className="font-semibold">Recurring schedules</h2><p className="mt-1 text-sm text-gray-500">{initial.length} configured schedules</p></div>
      <div className="divide-y">{initial.map(r=><div key={r.id} className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div><div className="flex items-center gap-3"><h3 className="font-semibold">{r.name}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.isActive?"bg-green-50 text-green-700":"bg-gray-100 text-gray-500"}`}>{r.isActive?"ACTIVE":"PAUSED"}</span></div><p className="mt-1 text-sm text-gray-500">{r.customer.companyName||[r.customer.firstName,r.customer.lastName].filter(Boolean).join(" ")} · {r.service.name}</p></div>
          <div className="grid grid-cols-3 gap-5 text-sm"><div><p className="text-xs text-gray-400">Frequency</p><p className="mt-1 font-semibold">{r.recurrenceType.replace("_"," ")}</p></div><div><p className="text-xs text-gray-400">Next run</p><p className="mt-1 font-semibold">{new Date(r.nextRunAt).toLocaleDateString()}</p></div><div><p className="text-xs text-gray-400">Price</p><p className="mt-1 font-semibold">{r.price!=null?Number(r.price).toLocaleString():"—"}</p></div></div>
          <button disabled={pending} onClick={()=>startTransition(async()=>{try{await toggleRecurringServiceAction(r.id,!r.isActive);setMessage(r.isActive?"Schedule paused.":"Schedule resumed.");}catch(e){setMessage(e instanceof Error?e.message:"Unable to update schedule.");}})} className="rounded-lg border px-4 py-2 text-sm font-semibold">{r.isActive?"Pause":"Resume"}</button>
        </div>
      </div>)}{!initial.length&&<p className="p-10 text-center text-sm text-gray-400">No recurring services configured.</p>}</div>
    </section>
  </div>;
}
