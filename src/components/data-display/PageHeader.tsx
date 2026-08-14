import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?:string; title:string; description?:string; actions?:ReactNode }) {
  return <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div>{eyebrow&&<p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{eyebrow}</p>}<h1 className="mt-1 text-[26px] font-bold leading-[1.2] tracking-tight">{title}</h1>{description&&<p className="mt-1 text-sm text-[var(--muted)]">{description}</p>}</div>{actions&&<div className="flex shrink-0 items-center gap-2">{actions}</div>}</div>;
}
