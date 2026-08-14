"use client";
import type { ReactNode } from "react";
import { cn } from "./cn";

export function Dropdown({ trigger, children, align="right" }: { trigger:ReactNode; children:ReactNode; align?:"left"|"right" }) {
  return <details className="relative"><summary className="list-none cursor-pointer [&::-webkit-details-marker]:hidden">{trigger}</summary><div className={cn("absolute top-full z-50 mt-2 min-w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl",align==="right"?"right-0":"left-0")}>{children}</div></details>;
}
