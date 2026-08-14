"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

export function ContractFilters({
  initialQuery = "",
  initialStatus = "",
}: {
  initialQuery?: string;
  initialStatus?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilters(nextQuery: string, nextStatus: string) {
    const params = new URLSearchParams(searchParams.toString());
    nextQuery.trim() ? params.set("q", nextQuery.trim()) : params.delete("q");
    nextStatus ? params.set("status", nextStatus) : params.delete("status");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    updateFilters(String(form.get("q") || ""), String(form.get("status") || ""));
  }

  function clear() {
    router.push(pathname);
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-2 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
        />
        <input
          name="q"
          defaultValue={initialQuery}
          placeholder="Search contract, customer or title..."
          className="jf-control h-9 w-full pl-9 pr-3 text-sm"
        />
      </div>

      <select
        name="status"
        value={initialStatus}
        onChange={(event) => {
          const query = (event.currentTarget.form?.elements.namedItem("q") as HTMLInputElement | null)?.value || "";
          updateFilters(query, event.target.value);
        }}
        className="jf-control h-9 px-3 text-sm sm:w-40"
        aria-label="Filter contracts by status"
      >
        <option value="">All statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="DRAFT">Draft</option>
        <option value="EXPIRED">Expired</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      <button
        type="submit"
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 text-sm font-bold text-white"
      >
        <Search size={14} />
        Search
      </button>

      {(initialQuery || initialStatus) && (
        <button
          type="button"
          onClick={clear}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          <X size={14} />
          Clear
        </button>
      )}
    </form>
  );
}
