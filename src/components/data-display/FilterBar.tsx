import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/Input";

export function FilterBar({ searchPlaceholder="Search...", searchValue, onSearch, children }: { searchPlaceholder?:string; searchValue?:string; onSearch?:(value:string)=>void; children?:ReactNode }) {
  return <div className="mb-4 flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:flex-row sm:items-center"><div className="relative min-w-0 flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"/><Input aria-label="Search" value={searchValue} onChange={e=>onSearch?.(e.target.value)} placeholder={searchPlaceholder} className="pl-9"/></div>{children&&<div className="flex flex-wrap gap-2">{children}</div>}</div>;
}
