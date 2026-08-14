import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export function Badge({ tone="neutral", className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral"|"success"|"warning"|"danger"|"info"|"primary" }) {
  const tones={
    neutral:"bg-[var(--surface-hover)] text-[var(--muted)]",
    success:"bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    warning:"bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    danger:"bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    info:"bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
    primary:"bg-[var(--primary-soft)] text-[var(--primary)]"
  };
  return <span {...props} className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",tones[tone],className)} />;
}
