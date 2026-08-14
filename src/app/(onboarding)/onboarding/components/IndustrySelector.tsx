 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { selectIndustryAction } from "../actions/actions";

type Template = { id: string; name: string; description: string | null };

export function IndustrySelector({ templates }: { templates: Template[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function continueSetup() {
    setSaving(true);
    setError("");
    try {
      await selectIndustryAction({
        industryId: selected || undefined,
        customIndustryName: custom.trim() || undefined,
      });
      router.push("/onboarding/services");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save industry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((industry) => (
          <button
            key={industry.id}
            type="button"
            onClick={() => { setSelected(industry.id); setCustom(""); }}
            className={`rounded-2xl border bg-white p-5 text-left shadow-sm ${
              selected === industry.id ? "border-blue-500 ring-2 ring-blue-100" : ""
            }`}
          >
            <span className="font-semibold">{industry.name}</span>
            <span className="mt-2 block text-sm text-gray-500">{industry.description}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSelected("")}
          className={`rounded-2xl border-2 border-dashed bg-white p-5 text-left ${
            !selected ? "border-blue-500 ring-2 ring-blue-100" : ""
          }`}
        >
          <span className="font-semibold">Create my own industry</span>
          <span className="mt-2 block text-sm text-gray-500">Use your own industry name.</span>
        </button>
      </div>

      {!selected && (
        <div className="mt-5 rounded-xl border bg-white p-5">
          <label className="block text-sm font-medium">Custom industry name</label>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="mt-2 w-full rounded-lg border px-3 py-2.5"
            placeholder="e.g. Swimming Pool Maintenance"
          />
        </div>
      )}

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-8 flex justify-between">
        <a href="/onboarding/business" className="rounded-lg border px-4 py-2.5 font-medium">Back</a>
        <button
          disabled={saving || (!selected && !custom.trim())}
          onClick={continueSetup}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}
