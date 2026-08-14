"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createServiceAction } from "../actions/actions";

const pricingTypes = [
  ["FIXED", "Fixed price"],
  ["HOURLY", "Hourly"],
  ["DAILY", "Daily"],
  ["QUANTITY", "Per quantity"],
  ["AREA", "Per area"],
  ["PER_ITEM", "Per item"],
  ["CUSTOM", "Custom"],
  ["QUOTE_REQUIRED", "Quote required"],
] as const;

type PricingType = (typeof pricingTypes)[number][0];

export function ServiceCreator({ industryId }: { industryId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pricingType, setPricingType] = useState<PricingType>("FIXED");
  const [basePrice, setBasePrice] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    try {
      await createServiceAction(industryId, {
        name,
        pricingType,
        basePrice: basePrice.trim() ? Number(basePrice) : undefined,
        estimatedMinutes: estimatedMinutes.trim() ? Number(estimatedMinutes) : undefined,
      });
      router.push("/onboarding/staff");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save service.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border bg-white p-7 shadow-sm">
      <p className="text-sm text-gray-500">
        Add your first service. The selected industry is already attached to this form.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-medium">Service name *</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border px-3 py-2.5" placeholder="General Pest Control" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Pricing model</span>
          <select value={pricingType} onChange={(e) => setPricingType(e.target.value as PricingType)} className="w-full rounded-lg border px-3 py-2.5">
            {pricingTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Base price</span>
          <input value={basePrice} onChange={(e) => setBasePrice(e.target.value)} type="number" min="0" step="0.01" className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Estimated duration (minutes)</span>
          <input value={estimatedMinutes} onChange={(e) => setEstimatedMinutes(e.target.value)} type="number" min="1" className="w-full rounded-lg border px-3 py-2.5" />
        </label>
      </div>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-8 flex justify-between border-t pt-5">
        <a href="/onboarding/industry" className="rounded-lg border px-4 py-2.5 font-medium">Back</a>
        <button disabled={saving || !name.trim()} onClick={save} className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50">
          {saving ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}
