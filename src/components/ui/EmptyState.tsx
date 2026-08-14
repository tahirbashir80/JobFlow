import type { ReactNode } from "react";
import { cn } from "./cn";

export function EmptyState({ icon, title, description, action, className }: { icon?:ReactNode; title:string; description?:string; action?:ReactNode; className?:string }) {
  return <div className={cn("flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] p-8 text-center",className)}>
    {icon && <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-[var(--surface-hover)] text-[var(--muted)]">{icon}</div>}
    <h3 className="font-semibold">{title}</h3>
    {description && <p className="mt-1 max-w-md text-sm text-[var(--muted)]">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>;
}
