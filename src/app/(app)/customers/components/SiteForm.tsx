"use client";

import { useState } from "react";
import { createSiteAction } from "../actions";

export function SiteForm({ customerId }: { customerId: string }) {
  const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setSaving(true); setError("");
    try { await createSiteAction(customerId, { name: String(formData.get("name") || ""), address: String(formData.get("address") || ""), city: String(formData.get("city") || ""), state: String(formData.get("state") || ""), postalCode: String(formData.get("postalCode") || ""), country: String(formData.get("country") || ""), contactName: String(formData.get("contactName") || ""), contactPhone: String(formData.get("contactPhone") || ""), accessInstructions: String(formData.get("accessInstructions") || ""), notes: String(formData.get("notes") || "") }); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to create site."); setSaving(false); }
  }
  return <form action={submit} className="mt-6 space-y-5 rounded-2xl border bg-white p-6 shadow-sm"><label><span className="mb-2 block text-sm font-medium">Site name *</span><input name="name" required placeholder="Main Office" className="w-full rounded-lg border px-3 py-2.5" /></label><label><span className="mb-2 block text-sm font-medium">Address</span><input name="address" className="w-full rounded-lg border px-3 py-2.5" /></label><div className="grid gap-5 sm:grid-cols-3"><input name="city" placeholder="City" className="rounded-lg border px-3 py-2.5" /><input name="state" placeholder="State / Province" className="rounded-lg border px-3 py-2.5" /><input name="postalCode" placeholder="Postal code" className="rounded-lg border px-3 py-2.5" /></div><div className="grid gap-5 sm:grid-cols-2"><input name="contactName" placeholder="Site contact" className="rounded-lg border px-3 py-2.5" /><input name="contactPhone" placeholder="Contact phone" className="rounded-lg border px-3 py-2.5" /></div><label><span className="mb-2 block text-sm font-medium">Access instructions</span><textarea name="accessInstructions" rows={3} className="w-full rounded-lg border px-3 py-2.5" /></label><label><span className="mb-2 block text-sm font-medium">Notes</span><textarea name="notes" rows={3} className="w-full rounded-lg border px-3 py-2.5" /></label>{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50">{saving ? "Creating..." : "Create Site"}</button></form>;
}
