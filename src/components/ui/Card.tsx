import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-sm", className)} />;
}
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("border-b border-[var(--border)] p-5", className)} />;
}
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 {...props} className={cn("text-base font-semibold tracking-tight", className)} />;
}
export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cn("mt-1 text-sm text-[var(--muted)]", className)} />;
}
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("p-5", className)} />;
}
export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("border-t border-[var(--border)] p-5", className)} />;
}
