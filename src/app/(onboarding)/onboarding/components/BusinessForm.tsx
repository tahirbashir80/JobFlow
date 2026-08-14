 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveBusinessAction } from "../actions/actions";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

export function BusinessForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setSaving(true);
    setError("");
    try {
      await saveBusinessAction({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        website: String(formData.get("website") || ""),
        address: String(formData.get("address") || ""),
        city: String(formData.get("city") || ""),
        state: String(formData.get("state") || ""),
        postalCode: String(formData.get("postalCode") || ""),
        country: String(formData.get("country") || "United States"),
        currency: String(formData.get("currency") || "USD"),
        timezone: String(formData.get("timezone") || "UTC"),
      });
      router.push("/onboarding/industry");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save business profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={submit} className="mt-8 space-y-6 rounded-2xl border bg-white p-7 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-medium">Business name *</span>
          <input name="name" required className="w-full rounded-lg border px-3 py-2.5" placeholder="Acme Services" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Business email</span>
          <input name="email" type="email" className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Phone</span>
          <input name="phone" className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-medium">Website</span>
          <input name="website" type="url" className="w-full rounded-lg border px-3 py-2.5" placeholder="https://example.com" />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-medium">Address</span>
          <input name="address" className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">City</span>
          <input name="city" className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">State / Province</span>
          <input name="state" className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Postal code</span>
          <input name="postalCode" className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Country</span>
          <input name="country" defaultValue="United States" className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Base currency *</span>
          <select name="currency" defaultValue="USD" className="w-full rounded-lg border bg-white px-3 py-2.5">
            {SUPPORTED_CURRENCIES.map(([code, name]) => <option key={code} value={code}>{code} — {name}</option>)}
          </select>
          <span className="mt-1 block text-xs text-gray-400">Used as the business reporting/default currency. Issued invoices keep their own currency.</span>
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Timezone</span>
          <input name="timezone" defaultValue="UTC" className="w-full rounded-lg border px-3 py-2.5" />
        </label>
      </div>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="flex justify-between border-t pt-5">
        <a href="/onboarding" className="rounded-lg border px-4 py-2.5 font-medium">Back</a>
        <button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50">
          {saving ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </form>
  );
}
