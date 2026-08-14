"use client";

import { useState, useTransition } from "react";
import { assignTechnicianSkillAction, removeTechnicianSkillAction, saveTechnicianAvailabilityAction } from "../../jobs/actions";
import { linkTechnicianUserAction } from "../actions";

const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export function TechnicianManager({ technician, services, users }: { technician: any; services: any[]; users: any[] }) {
  const [skill, setSkill] = useState(technician.skills[0]?.serviceId || "");
  const [proficiency, setProficiency] = useState(String(technician.skills[0]?.proficiency ?? 3));
  const [pending,startTransition]=useTransition();
  const [message,setMessage]=useState("");
  const [linkedUserId,setLinkedUserId]=useState(technician.userId || "");

  const hasSkill=(id:string)=>technician.skills.some((s:any)=>s.serviceId===id);

  function addSkill() {
    if(!skill) return;
    setMessage("");
    startTransition(async()=>{try{await assignTechnicianSkillAction(technician.id,skill,Number(proficiency));setMessage("Skill saved.");}catch(e){setMessage(e instanceof Error?e.message:"Unable to save skill.");}});
  }
  function removeSkill(id:string) {
    startTransition(async()=>{try{await removeTechnicianSkillAction(technician.id,id);setMessage("Skill removed.");}catch(e){setMessage(e instanceof Error?e.message:"Unable to remove skill.");}});
  }
  function saveAvailability(day:number,start:string,end:string,available:boolean) {
    startTransition(async()=>{try{await saveTechnicianAvailabilityAction(technician.id,day,start,end,available);setMessage("Availability saved.");}catch(e){setMessage(e instanceof Error?e.message:"Unable to save availability.");}});
  }

  return <div className="space-y-6">
    {message && <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">{message}</div>}

    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="font-semibold">Login account</h2>
      <p className="mt-1 text-sm text-gray-500">Link this technician to a JobFlow user account so assignment notifications can be delivered to them.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <select value={linkedUserId} onChange={e=>setLinkedUserId(e.target.value)} className="flex-1 rounded-lg border px-3 py-2.5">
          <option value="">No linked account</option>
          {users.map((u:any)=><option key={u.id} value={u.id}>{u.firstName} {u.lastName||""} — {u.email} {u.status!=="ACTIVE"?"("+u.status+")":""}</option>)}
        </select>
        <button disabled={pending} onClick={()=>startTransition(async()=>{try{await linkTechnicianUserAction(technician.id,linkedUserId||null);setMessage(linkedUserId?"User account linked.":"User account unlinked.");}catch(e){setMessage(e instanceof Error?e.message:"Unable to update user account.");}})} className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50">Save Account</button>
      </div>
      <p className="mt-3 text-xs text-gray-400">Current: {technician.userId ? "Linked" : "Not linked"}</p>
    </section>

    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="font-semibold">Service skills</h2><p className="mt-1 text-sm text-gray-500">Only qualified technicians should be assigned to services.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row"><select value={skill} onChange={e=>setSkill(e.target.value)} className="flex-1 rounded-lg border px-3 py-2.5"><option value="">Select service</option>{services.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select><select value={proficiency} onChange={e=>setProficiency(e.target.value)} className="rounded-lg border px-3 py-2.5"><option value="1">1 — Basic</option><option value="2">2 — Working</option><option value="3">3 — Proficient</option><option value="4">4 — Advanced</option><option value="5">5 — Expert</option></select><button disabled={pending||!skill} onClick={addSkill} className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50">Save Skill</button></div>
      <div className="mt-5 divide-y">{technician.skills.map((s:any)=><div key={s.id} className="flex items-center justify-between py-3"><div><p className="font-medium">{s.service.name}</p><p className="text-xs text-gray-500">Proficiency {s.proficiency ?? "—"}</p></div><button disabled={pending} onClick={()=>removeSkill(s.serviceId)} className="text-sm font-semibold text-red-600">Remove</button></div>)}</div>
    </section>
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="font-semibold">Weekly availability</h2><p className="mt-1 text-sm text-gray-500">Set the technician's normal working window.</p>
      <div className="mt-5 divide-y">{days.map((day,i)=>{const a=technician.availability.find((x:any)=>x.dayOfWeek===i);return <div key={day} className="grid gap-3 py-3 sm:grid-cols-[1fr_120px_120px_100px] sm:items-center"><div className="font-medium">{day}</div><input type="time" defaultValue={a?.startTime||"09:00"} id={`start-${i}`} className="rounded-lg border px-2 py-2"/><input type="time" defaultValue={a?.endTime||"17:00"} id={`end-${i}`} className="rounded-lg border px-2 py-2"/><button disabled={pending} onClick={()=>saveAvailability(i,(document.getElementById(`start-${i}`) as HTMLInputElement).value,(document.getElementById(`end-${i}`) as HTMLInputElement).value,true)} className="rounded-lg border px-3 py-2 text-sm font-semibold">Save</button></div>})}</div>
    </section>
  </div>;
}
