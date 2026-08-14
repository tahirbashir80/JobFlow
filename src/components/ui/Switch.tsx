"use client";
import { cn } from "./cn";

export function Switch({ checked, onCheckedChange, label }: { checked:boolean; onCheckedChange:(value:boolean)=>void; label?:string }) {
  return <button type="button" role="switch" aria-checked={checked} onClick={()=>onCheckedChange(!checked)} className="inline-flex items-center gap-3">
    {label && <span className="text-sm font-medium">{label}</span>}
    <span className={cn("relative h-6 w-11 rounded-full transition", checked ? "bg-[var(--primary)]" : "bg-gray-300 dark:bg-gray-700")}><span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow transition", checked ? "left-6" : "left-1")} /></span>
  </button>;
}
