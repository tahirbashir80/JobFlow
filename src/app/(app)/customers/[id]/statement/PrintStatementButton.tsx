"use client";

export function PrintStatementButton() {
  return <button type="button" onClick={() => window.print()} className="rounded-lg border bg-white px-4 py-2 font-semibold">Print / Save PDF</button>;
}
