"use client";

import { useState } from "react";
import { Archive, MoreHorizontal, Pencil, X } from "lucide-react";
import Link from "next/link";
import { archiveCustomerAction } from "../actions";

export function CustomerActions({ customerId }: { customerId: string }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function archive() {
    setSaving(true);
    await archiveCustomerAction(customerId);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Link href={`/customers/${customerId}/edit`} className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold transition hover:bg-[var(--surface-hover)]">
          <Pencil size={14} /> Edit
        </Link>
        <button type="button" onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-[9px] border border-[var(--border)] text-[var(--muted)] transition hover:bg-[var(--surface-hover)]" aria-label="More customer actions">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold">Archive customer?</h2>
                <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
                  The customer will be removed from active lists and marked inactive. Historical jobs, sites and invoices remain preserved.
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid h-7 w-7 place-items-center rounded-lg hover:bg-[var(--surface-hover)]" aria-label="Close">
                <X size={14} />
              </button>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="h-9 rounded-[9px] border border-[var(--border)] px-3.5 text-xs font-semibold">
                Cancel
              </button>
              <button type="button" disabled={saving} onClick={archive} className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[var(--danger)] px-3.5 text-xs font-semibold text-white disabled:opacity-50">
                <Archive size={14} /> {saving ? "Archiving..." : "Archive Customer"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
