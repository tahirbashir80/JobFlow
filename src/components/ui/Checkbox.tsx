import type { InputHTMLAttributes } from "react";

export function Checkbox({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?:string }) {
  return <label className="inline-flex cursor-pointer items-center gap-2 text-sm"><input {...props} type="checkbox" className="h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)]" />{label && <span>{label}</span>}</label>;
}
