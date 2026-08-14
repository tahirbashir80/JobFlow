"use client";

import { useState } from "react";
import { updateJobStatusAction } from "../actions";

const statuses = ["SCHEDULED","ASSIGNED","DISPATCHED","EN_ROUTE","ON_SITE","IN_PROGRESS","PAUSED","COMPLETED","CANCELLED","RESCHEDULED","FAILED","INCOMPLETE"] as const;

export function JobStatusControl({ jobId, current }: { jobId: string; current: string }) {
  const [saving, setSaving] = useState(false);
  async function change(status: typeof statuses[number]) {
    setSaving(true);
    try { await updateJobStatusAction(jobId, status); }
    finally { setSaving(false); }
  }
  return (
    <select disabled={saving} value={current} onChange={(e) => change(e.target.value as typeof statuses[number])}
      className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold">
      {statuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
    </select>
  );
}
