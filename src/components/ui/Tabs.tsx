"use client";
import { cn } from "./cn";
import type { ReactNode } from "react";

export function Tabs({ tabs, value, onChange }: { tabs:Array<{id:string;label:string;content?:ReactNode}>; value:string; onChange:(id:string)=>void }) {
  const current=tabs.find(t=>t.id===value);
  return <div><div className="flex gap-1 overflow-x-auto border-b border-[var(--border)]">{tabs.map(t=><button key={t.id} onClick={()=>onChange(t.id)} className={cn("relative whitespace-nowrap rounded-none border-0 border-b px-4 py-2.5 text-[13px] font-semibold transition",value===t.id?"rounded-t-md border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]":"border-transparent text-[var(--muted)] hover:rounded-t-md hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]")}>{t.label}</button>)}</div>{current?.content&&<div className="pt-5">{current.content}</div>}</div>;
}
