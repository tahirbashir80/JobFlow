import { cn } from "./cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
};

export function Button({ variant="primary", size="md", icon, className, children, ...props }: ButtonProps) {
  const variants = {
    primary: "bg-[var(--primary)] text-white hover:opacity-90",
    secondary: "bg-[var(--surface-hover)] text-[var(--foreground)] hover:opacity-90",
    ghost: "bg-transparent text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
    danger: "bg-[var(--danger)] text-white hover:opacity-90",
    outline: "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]",
  };
  const sizes = { sm:"h-9 px-3 text-xs", md:"h-10 px-4 text-sm", lg:"h-11 px-5 text-sm" };
  return <button {...props} className={cn("inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)}>
    {icon}{children}
  </button>;
}
