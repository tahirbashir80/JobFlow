"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboardingAction } from "../actions/actions";

export function CompleteOnboardingButton() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function complete() {
    setSaving(true);
    setError("");
    try {
      await completeOnboardingAction();
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to complete onboarding.");
      setSaving(false);
    }
  }

  return (
    <div className="mt-7">
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button onClick={complete} disabled={saving} className="inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50">
        {saving ? "Finishing setup..." : "Enter JobFlow"}
      </button>
    </div>
  );
}
