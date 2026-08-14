import { cn } from "./cn";
export function Skeleton({ className="" }: { className?:string }) { return <div aria-hidden="true" className={cn("animate-pulse rounded-lg bg-[var(--surface-hover)]",className)} />; }
