"use client";
import { cn } from "./cn";
import type { ReactNode } from "react";

export function Tabs({ tabs, value, onChange }: { tabs:Array<{id:string;label:string;content?:ReactNode}>; value:string; onChange:(id:string)=>void }) {
  const current=tabs.find(t=>t.id===value);
  return <div><div className="flex gap-1 overflow-x-auto border-b border-[var(--border)]">{tabs.map(t=><button key={t.id} onClick={()=>onChange(t.id)} className={cn("relative whitespace-nowrap px-4 py-3 text-sm font-medium",value===t.id?"text-[var(--primary)]":"text-[var(--muted)] hover:text-[var(--foreground)]")}>{t.label}{value===t.id&&<span className="absolute inset-x-3 -bottom-px h-0.5 bg-[var(--primary)]"/>}</button>)}</div>{current?.content&&<div className="pt-5">{current.content}</div>}</div>;
}
