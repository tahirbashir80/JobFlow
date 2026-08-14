import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export function Badge({ tone="neutral", className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral"|"success"|"warning"|"danger"|"info"|"primary" }) {
  const tones={
    neutral:"border border-[#d2dcda] bg-[var(--surface-hover)] text-[var(--muted)]",
    success:"border border-[#b9dec7] bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    warning:"border border-[#ead39b] bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
    danger:"border border-[#edbcbc] bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
    info:"border border-[#bfd5e7] bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
    primary:"border border-[#b9dcd7] bg-[var(--primary-soft)] text-[var(--primary)]"
  };
  return <span {...props} className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",tones[tone],className)} />;
}
