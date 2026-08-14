import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "../ui/Card";

export function MetricCard({ label, value, trend, trendLabel, icon, tone="neutral" }: { label:string; value:string|number; trend?:number; trendLabel?:string; icon?:ReactNode; tone?:"neutral"|"success"|"warning"|"danger"|"primary" }) {
  const positive=trend !== undefined && trend >= 0;
  const toneClass={neutral:"text-[var(--muted)]",success:"text-[var(--success)]",warning:"text-[var(--warning)]",danger:"text-[var(--danger)]",primary:"text-[var(--primary)]"};
  return <Card className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-[var(--muted)]">{label}</p><p className="mt-2 text-[24px] font-bold leading-[1.2] tracking-tight">{value}</p>{trend!==undefined&&<p className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${toneClass[tone]}`}>{positive?<ArrowUpRight size={14}/>:<ArrowDownRight size={14}/>} {Math.abs(trend)}% {trendLabel ?? "vs previous period"}</p>}</div>{icon&&<div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">{icon}</div>}</div></Card>;
}
