 "use client";

import { useState } from "react";
import { completeJobAction, startJobAction } from "../actions";

export function JobExecutionPanel({
  jobId,
  status,
  completion,
}: {
  jobId: string;
  status: string;
  completion: {
    workPerformed: string | null;
    findings: string | null;
    recommendations: string | null;
    customerComments: string | null;
    internalNotes: string | null;
    customerApproved: boolean;
  } | null;
}) {
  const [workPerformed, setWorkPerformed] = useState(completion?.workPerformed ?? "");
  const [findings, setFindings] = useState(completion?.findings ?? "");
  const [recommendations, setRecommendations] = useState(completion?.recommendations ?? "");
  const [customerComments, setCustomerComments] = useState(completion?.customerComments ?? "");
  const [internalNotes, setInternalNotes] = useState(completion?.internalNotes ?? "");
  const [customerApproved, setCustomerApproved] = useState(completion?.customerApproved ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (completion || status === "COMPLETED") {
    return (
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Completion record</h2>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">COMPLETED</span>
        </div>
        <dl className="mt-5 space-y-4 text-sm">
          <div><dt className="font-semibold">Work performed</dt><dd className="mt-1 whitespace-pre-wrap text-gray-600">{completion?.workPerformed || "—"}</dd></div>
          <div><dt className="font-semibold">Findings</dt><dd className="mt-1 whitespace-pre-wrap text-gray-600">{completion?.findings || "—"}</dd></div>
          <div><dt className="font-semibold">Recommendations</dt><dd className="mt-1 whitespace-pre-wrap text-gray-600">{completion?.recommendations || "—"}</dd></div>
          <div><dt className="font-semibold">Customer comments</dt><dd className="mt-1 whitespace-pre-wrap text-gray-600">{completion?.customerComments || "—"}</dd></div>
          <div><dt className="font-semibold">Customer approved</dt><dd className="mt-1 text-gray-600">{completion?.customerApproved ? "Yes" : "No"}</dd></div>
        </dl>
      </section>
    );
  }

  async function start() {
    setBusy(true); setError("");
    try { await startJobAction(jobId); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to start the job."); }
    finally { setBusy(false); }
  }

  async function complete() {
    setBusy(true); setError("");
    try {
      await completeJobAction(jobId, {
        workPerformed, findings, recommendations, customerComments, internalNotes, customerApproved,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to complete the job.");
      setBusy(false);
    }
  }

  const canStart = ["ASSIGNED", "DISPATCHED", "EN_ROUTE", "ON_SITE", "SCHEDULED"].includes(status);

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-semibold">Job execution</h2><p className="mt-1 text-sm text-gray-500">Record what happened in the field and complete the job.</p></div>
        {canStart && <button disabled={busy} onClick={start} className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50">{busy ? "Starting..." : "Start Job"}</button>}
      </div>

      {["IN_PROGRESS", "ON_SITE", "PAUSED"].includes(status) && (
        <div className="mt-6 space-y-5">
          <label className="block"><span className="mb-2 block text-sm font-medium">Work performed *</span><textarea rows={5} value={workPerformed} onChange={(e) => setWorkPerformed(e.target.value)} className="w-full rounded-lg border px-3 py-2.5" placeholder="Describe the work completed..." /></label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label><span className="mb-2 block text-sm font-medium">Findings</span><textarea rows={4} value={findings} onChange={(e) => setFindings(e.target.value)} className="w-full rounded-lg border px-3 py-2.5" /></label>
            <label><span className="mb-2 block text-sm font-medium">Recommendations</span><textarea rows={4} value={recommendations} onChange={(e) => setRecommendations(e.target.value)} className="w-full rounded-lg border px-3 py-2.5" /></label>
            <label><span className="mb-2 block text-sm font-medium">Customer comments</span><textarea rows={4} value={customerComments} onChange={(e) => setCustomerComments(e.target.value)} className="w-full rounded-lg border px-3 py-2.5" /></label>
            <label><span className="mb-2 block text-sm font-medium">Internal notes</span><textarea rows={4} value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} className="w-full rounded-lg border px-3 py-2.5" /></label>
          </div>
          <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={customerApproved} onChange={(e) => setCustomerApproved(e.target.checked)} /> Customer approved / acknowledged the completed work</label>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="flex justify-end"><button disabled={busy || !workPerformed.trim()} onClick={complete} className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50">{busy ? "Completing..." : "Complete Job"}</button></div>
        </div>
      )}

      {status === "SCHEDULED" && <p className="mt-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">The technician can start this job when work begins.</p>}
    </section>
  );
}
