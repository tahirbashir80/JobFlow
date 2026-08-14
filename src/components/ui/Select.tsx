import type { SelectHTMLAttributes } from "react";
import { cn } from "./cn";

export function Select({ label, children, className, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?:string }) {
  return <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium">{label}</label>}
    <select {...props} className={cn("h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[13px] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",className)}>{children}</select>
  </div>;
}
