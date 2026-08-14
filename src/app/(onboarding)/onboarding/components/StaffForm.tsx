 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createStaffAction } from "../actions/actions";

export function StaffForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save(formData: FormData) {
    setSaving(true);
    setError("");
    try {
      await createStaffAction({
        firstName: String(formData.get("firstName") || ""),
        lastName: String(formData.get("lastName") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        roleTitle: String(formData.get("roleTitle") || ""),
      });
      router.push("/onboarding/complete");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save staff member.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={save} className="mt-8 rounded-2xl border bg-white p-7 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-medium">First name *</span>
          <input name="firstName" required className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Last name</span>
          <input name="lastName" className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Email</span>
          <input name="email" type="email" className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Phone</span>
          <input name="phone" className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-medium">Role / title</span>
          <input name="roleTitle" className="w-full rounded-lg border px-3 py-2.5" placeholder="Technician" />
        </label>
      </div>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-8 flex justify-between border-t pt-5">
        <a href="/onboarding/services" className="rounded-lg border px-4 py-2.5 font-medium">Back</a>
        <button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50">
          {saving ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </form>
  );
}
