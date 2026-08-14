"use client";
import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Drawer({ open, onClose, title, children, side="right" }: { open:boolean; onClose:()=>void; title:string; children:ReactNode; side?:"left"|"right" }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={title}>
    <button aria-label="Close drawer" className="absolute inset-0 bg-black/35" onClick={onClose} />
    <aside className={`absolute inset-y-0 ${side==="right"?"right-0":"left-0"} w-full max-w-xl border-[var(--border)] bg-[var(--surface)] shadow-2xl`}>
      <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-6"><h2 className="font-semibold">{title}</h2><button onClick={onClose} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-hover)]" aria-label="Close"><X size={18}/></button></div>
      <div className="h-[calc(100%-4rem)] overflow-y-auto p-6">{children}</div>
    </aside>
  </div>;
}
