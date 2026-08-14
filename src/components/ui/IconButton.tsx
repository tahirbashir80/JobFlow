import { cn } from "./cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function IconButton({ label, icon, size="md", className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label:string; icon:ReactNode; size?:"sm"|"md"|"lg" }) {
  const sizes={sm:"h-8 w-8",md:"h-9 w-9",lg:"h-10 w-10"};
  return <button {...props} aria-label={label} title={label} className={cn("inline-grid place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] disabled:opacity-50",sizes[size],className)}>{icon}</button>;
}
