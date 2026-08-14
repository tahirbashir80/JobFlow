import type { TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

export function Textarea({ label, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?:string }) {
  return <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium">{label}</label>}
    <textarea {...props} className={cn("min-h-24 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",className)} />
  </div>;
}
