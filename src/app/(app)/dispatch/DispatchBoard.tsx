"use client";

import { useState, useTransition } from "react";
import { assignJobAction, unassignJobAction } from "../jobs/actions";

type Job = {
  id: string; jobNumber: string; status: string; scheduledStart: string | null; scheduledEnd: string | null;
  title: string | null; customer: { firstName: string|null; lastName: string|null; companyName: string|null };
  site: { name: string } | null; service: { id: string; name: string };
  assignments: { staff: { id:string; firstName:string; lastName:string|null } }[];
};
type Staff = { id:string; firstName:string; lastName:string|null; skills?: { serviceId:string }[] };

function customerName(c: Job["customer"]) {
  return c.companyName || [c.firstName,c.lastName].filter(Boolean).join(" ") || "Customer";
}
function time(v: string|null) { return v ? new Date(v).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) : "—"; }

export function DispatchBoard({ jobs, staff }: { jobs: Job[]; staff: Staff[] }) {
  const [selected, setSelected] = useState<Record<string,string>>({});
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  async function assign(jobId:string) {
    const staffId=selected[jobId];
    if(!staffId) return;
    setError("");
    startTransition(async()=>{ try { await assignJobAction(jobId,staffId); } catch(e){ setError(e instanceof Error?e.message:"Unable to assign job."); }});
  }
  async function unassign(jobId:string) {
    setError("");
    startTransition(async()=>{ try { await unassignJobAction(jobId); } catch(e){ setError(e instanceof Error?e.message:"Unable to unassign job."); }});
  }

  return <div>
    {error && <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="grid gap-5 xl:grid-cols-3">
      {(["UNASSIGNED","ASSIGNED","IN_PROGRESS"] as const).map((column)=>{
        const columnJobs=jobs.filter(j=>{
          if(column==="UNASSIGNED") return !j.assignments.length && ["NEW","SCHEDULED"].includes(j.status);
          if(column==="ASSIGNED") return j.assignments.length > 0 && ["ASSIGNED","DISPATCHED"].includes(j.status);
          return ["IN_PROGRESS","ON_SITE","EN_ROUTE"].includes(j.status);
        });
        return <section key={column} className="rounded-2xl border bg-gray-50 p-4">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-bold">{column.replace("_"," ")}</h2><span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold">{columnJobs.length}</span></div>
          <div className="space-y-3">
            {columnJobs.map(job=><article key={job.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex justify-between gap-3"><div><p className="font-mono text-xs text-gray-400">{job.jobNumber}</p><h3 className="mt-1 font-semibold">{job.title || job.service.name}</h3></div><span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold">{job.status.replaceAll("_"," ")}</span></div>
              <p className="mt-3 text-sm font-medium">{customerName(job.customer)}</p>
              <p className="text-xs text-gray-500">{job.site?.name || "No site"} · {time(job.scheduledStart)}–{time(job.scheduledEnd)}</p>
              {job.assignments[0] && <p className="mt-2 text-xs text-gray-500">Tech: {job.assignments[0].staff.firstName} {job.assignments[0].staff.lastName||""}</p>}
              {column==="UNASSIGNED" ? <div className="mt-4 flex gap-2"><select value={selected[job.id]||""} onChange={e=>setSelected({...selected,[job.id]:e.target.value})} className="min-w-0 flex-1 rounded-lg border px-2 py-2 text-sm"><option value="">Select technician</option>{staff.filter(s=>!s.skills?.length || s.skills.some(sk=>sk.serviceId===job.service.id)).map(s=><option key={s.id} value={s.id}>{s.firstName} {s.lastName||""}</option>)}</select><button disabled={pending||!selected[job.id]} onClick={()=>assign(job.id)} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Assign</button></div>
              : <button disabled={pending} onClick={()=>unassign(job.id)} className="mt-4 rounded-lg border px-3 py-2 text-xs font-semibold">Unassign</button>}
            </article>)}
            {!columnJobs.length && <p className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-400">No jobs</p>}
          </div>
        </section>;
      })}
    </div>
  </div>;
}
