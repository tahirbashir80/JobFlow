import { cn } from "./cn";

export function Avatar({ name, src, size="md", className }: { name:string; src?:string|null; size?:"sm"|"md"|"lg"; className?:string }) {
  const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();
  const sizes={sm:"h-7 w-7 text-[10px]",md:"h-9 w-9 text-xs",lg:"h-11 w-11 text-sm"};
  return src ? <img src={src} alt={name} className={cn("rounded-full object-cover",sizes[size],className)} /> : <span title={name} className={cn("inline-grid place-items-center rounded-full bg-[var(--primary-soft)] font-bold text-[var(--primary)]",sizes[size],className)}>{initials}</span>;
}
