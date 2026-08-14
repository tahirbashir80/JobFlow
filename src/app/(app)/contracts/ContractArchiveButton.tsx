"use client";

import { Archive, X, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function ContractArchiveButton({ action }: { action: () => void | Promise<void> }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Archive contract"
        title="Archive contract"
        onClick={() => setOpen(true)}
        className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
      >
        <Archive size={14} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-contract-title"
            aria-describedby="archive-contract-description"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
          >
            <div className="flex items-start gap-3 border-b border-[var(--border)] p-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--danger-soft)] text-[var(--danger)]">
                <AlertTriangle size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="archive-contract-title" className="text-base font-bold text-[var(--foreground)]">
                  Archive contract?
                </h2>
                <p id="archive-contract-description" className="mt-1 text-sm leading-5 text-[var(--muted)]">
                  This contract will be removed from the active Contracts list and marked as Cancelled. This action should only be used when you are sure.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close confirmation"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex justify-end gap-2 p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              >
                Cancel
              </button>
              <form action={action}>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--danger)] px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"
                >
                  Archive Contract
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
