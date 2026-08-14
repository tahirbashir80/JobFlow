"use client";

import { useState } from "react";
import { updateCustomerProfileAction } from "../actions";

type EditInitial = {
  type: "RESIDENTIAL" | "COMMERCIAL" | "CORPORATE" | "PROPERTY_MANAGER" | "OTHER";
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  email: string;
  notes: string;
};

type Props = {
  mode?: "create" | "edit";
  customerId?: string;
  initial?: EditInitial;
};

export function CustomerForm({ mode = "create", customerId, initial }: Props) {
  const editing = mode === "edit" && Boolean(customerId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    if (!editing || !customerId) return;
    setSaving(true);
    setError("");
    try {
      await updateCustomerProfileAction(customerId, {
        type: String(formData.get("type") || "RESIDENTIAL") as EditInitial["type"],
        firstName: String(formData.get("firstName") || ""),
        lastName: String(formData.get("lastName") || ""),
        companyName: String(formData.get("companyName") || ""),
        phone: String(formData.get("phone") || ""),
        email: String(formData.get("email") || ""),
        notes: String(formData.get("notes") || ""),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update customer.");
      setSaving(false);
    }
  }

  const inputClass =
    "h-9 w-full rounded-[9px] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 text-xs outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--primary)]/10";

  if (!editing) {
    return <div className="text-xs text-[var(--muted)]">Use the Customer Onboarding form to create a new customer.</div>;
  }

  return (
    <form action={submit} className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-[11px] font-semibold">Customer Type</span>
          <select name="type" defaultValue={initial?.type} className={inputClass}>
            <option value="RESIDENTIAL">Residential</option>
            <option value="COMMERCIAL">Commercial</option>
            <option value="CORPORATE">Corporate</option>
            <option value="PROPERTY_MANAGER">Property Manager</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-[11px] font-semibold">First Name</span>
          <input name="firstName" defaultValue={initial?.firstName} className={inputClass} />
        </label>
        <label>
          <span className="mb-1.5 block text-[11px] font-semibold">Last Name</span>
          <input name="lastName" defaultValue={initial?.lastName} className={inputClass} />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-[11px] font-semibold">Company Name</span>
          <input name="companyName" defaultValue={initial?.companyName} className={inputClass} />
        </label>
        <label>
          <span className="mb-1.5 block text-[11px] font-semibold">Phone</span>
          <input name="phone" defaultValue={initial?.phone} className={inputClass} />
        </label>
        <label>
          <span className="mb-1.5 block text-[11px] font-semibold">Email</span>
          <input name="email" type="email" defaultValue={initial?.email} className={inputClass} />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-[11px] font-semibold">Notes</span>
          <textarea name="notes" rows={4} maxLength={4000} defaultValue={initial?.notes} className={`${inputClass} h-auto py-2.5`} />
        </label>
      </div>

      {error ? <p className="mt-4 rounded-[9px] bg-[var(--danger-soft)] px-3 py-2.5 text-xs font-medium text-[var(--danger)]">{error}</p> : null}

      <div className="mt-5 flex justify-end gap-2 border-t border-[var(--border)] pt-4">
        <a href={`/customers/${customerId}`} className="inline-flex h-9 items-center rounded-[9px] border border-[var(--border)] px-3.5 text-xs font-semibold">Cancel</a>
        <button disabled={saving} className="inline-flex h-9 items-center rounded-[9px] bg-[var(--primary)] px-4 text-xs font-semibold text-white disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
