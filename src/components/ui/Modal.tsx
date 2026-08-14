"use client";
import type { ReactNode } from "react";

export function Modal({ open, onClose, title, children, footer }: { open:boolean; onClose:()=>void; title:string; children:ReactNode; footer?:ReactNode }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[100] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={title}>
    <button aria-label="Close dialog" className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
    <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
      <div className="border-b border-[var(--border)] px-6 py-4"><h2 className="font-semibold">{title}</h2></div>
      <div className="p-6">{children}</div>
      {footer && <div className="border-t border-[var(--border)] bg-[var(--surface-hover)] px-6 py-4">{footer}</div>}
    </div>
  </div>;
}
