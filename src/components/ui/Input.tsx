import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

export function Input({ label, hint, error, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?:string; hint?:string; error?:string }) {
  return <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium">{label}</label>}
    <input {...props} className={cn("h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[13px] text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",className)} />
    {error ? <p className="text-xs font-medium text-[var(--danger)]">{error}</p> : hint ? <p className="text-xs text-[var(--muted)]">{hint}</p> : null}
  </div>;
}
