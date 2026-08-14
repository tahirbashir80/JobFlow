"use client";

import { useTransition } from "react";
import { createServiceReportAction } from "../actions";

export function ServiceReportButton({ jobId, hasReport }: { jobId: string; hasReport: boolean }) {
  const [pending, startTransition] = useTransition();

  if (hasReport) {
    return <a href={`/jobs/${jobId}/report`} className="rounded-lg border bg-white px-4 py-2.5 font-semibold text-gray-800">View Service Report</a>;
  }

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => { void createServiceReportAction(jobId); })}
      className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50"
    >
      {pending ? "Generating..." : "Generate Service Report"}
    </button>
  );
}
