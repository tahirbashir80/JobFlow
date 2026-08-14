 "use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createJobAction } from "../actions";

type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  sites: { id: string; name: string; city: string | null; state: string | null }[];
};
type Service = { id: string; name: string; basePrice: unknown; estimatedMinutes: number | null };
type Staff = { id: string; firstName: string; lastName: string | null; roleTitle: string | null };
type Contract = { id: string; contractNumber: string; title: string; customerId: string; siteId: string | null; serviceId: string | null; billingCycle: string; endDate: string | null };

const customerLabel = (c: Customer) =>
  c.companyName?.trim() || [c.firstName, c.lastName].filter(Boolean).join(" ").trim() || "Unnamed customer";

export function JobForm({
  customers,
  services,
  staff,
  contracts,
}: {
  customers: Customer[];
  services: Service[];
  staff: Staff[];
  contracts: Contract[];
}) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [siteId, setSiteId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [contractId, setContractId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const customer = customers.find((c) => c.id === customerId);
  const service = services.find((s) => s.id === serviceId);
  const applicableContracts = contracts.filter((contract) =>
    contract.customerId === customerId &&
    (!contract.siteId || contract.siteId === siteId) &&
    (!contract.serviceId || contract.serviceId === serviceId),
  );

  const sites = customer?.sites ?? [];
  const suggestedPrice = useMemo(() => {
    if (!service?.basePrice) return "";
    return String(service.basePrice);
  }, [service]);

  function chooseService(id: string) {
    setServiceId(id);
    setContractId("");
    const s = services.find((item) => item.id === id);
    if (s?.basePrice != null) setPrice(String(s.basePrice));
    if (s?.estimatedMinutes && date && start) {
      const [h, m] = start.split(":").map(Number);
      const d = new Date(`${date}T00:00:00`);
      d.setHours(h, m + s.estimatedMinutes, 0, 0);
      setEnd(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    }
  }

  async function submit() {
    setSaving(true);
    setError("");
    try {
      if (!date || !start || !end) throw new Error("Select the scheduled date, start time and end time.");
      await createJobAction({
        customerId,
        siteId: siteId || undefined,
        serviceId,
        contractId: contractId || undefined,
        scheduledStart: (() => {
          const value = new Date(`${date}T${start}`);
          return value.toISOString();
        })(),
        scheduledEnd: (() => {
          const startValue = new Date(`${date}T${start}`);
          const endValue = new Date(`${date}T${end}`);
          // A time earlier than the start is treated as an overnight job.
          if (endValue <= startValue) endValue.setDate(endValue.getDate() + 1);
          return endValue.toISOString();
        })(),
        priority: priority as "LOW" | "NORMAL" | "HIGH" | "URGENT",
        price: price.trim() ? Number(price) : undefined,
        title,
        description,
        customerNotes,
        internalNotes,
        staffId: staffId || undefined,
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create job.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-7 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-medium">Customer *</span>
          <select value={customerId} onChange={(e) => { setCustomerId(e.target.value); setSiteId(""); setContractId(""); }} className="w-full rounded-lg border px-3 py-2.5">
            <option value="">Select customer</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{customerLabel(c)}</option>)}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium">Site</span>
          <select value={siteId} onChange={(e) => { setSiteId(e.target.value); setContractId(""); }} disabled={!customerId} className="w-full rounded-lg border px-3 py-2.5 disabled:bg-gray-100">
            <option value="">Select site</option>
            {sites.map((s) => <option key={s.id} value={s.id}>{s.name}{s.city ? ` — ${s.city}` : ""}</option>)}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium">Service *</span>
          <select value={serviceId} onChange={(e) => chooseService(e.target.value)} className="w-full rounded-lg border px-3 py-2.5">
            <option value="">Select service</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {suggestedPrice && <span className="mt-1 block text-xs text-gray-400">Base price: {suggestedPrice}</span>}
        </label>

        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-medium">Contract <span className="font-normal text-gray-400">optional</span></span>
          <select
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            disabled={!customerId}
            className="w-full rounded-lg border px-3 py-2.5 disabled:bg-gray-100"
          >
            <option value="">No contract</option>
            {applicableContracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.contractNumber} — {contract.title}
              </option>
            ))}
          </select>
          {customerId && applicableContracts.length === 0 ? (
            <span className="mt-1 block text-xs text-gray-400">No active contract applies to the selected customer, site and service.</span>
          ) : (
            <span className="mt-1 block text-xs text-gray-400">Only active contracts matching the selected customer, site and service are shown.</span>
          )}
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium">Date *</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Priority</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-lg border px-3 py-2.5">
            <option value="LOW">Low</option><option value="NORMAL">Normal</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Start time *</span>
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">End time *</span>
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Assign technician</span>
          <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className="w-full rounded-lg border px-3 py-2.5">
            <option value="">Assign later</option>
            {staff.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName ?? ""}{s.roleTitle ? ` — ${s.roleTitle}` : ""}</option>)}
          </select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Price</span>
          <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-medium">Job title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border px-3 py-2.5" placeholder="e.g. Monthly pest control service" />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-medium">Description</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Customer notes</span>
          <textarea value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">Internal notes</span>
          <textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2.5" />
        </label>
      </div>

      {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-7 flex justify-between border-t pt-5">
        <a href="/jobs" className="rounded-lg border px-4 py-2.5 font-medium">Cancel</a>
        <button disabled={saving || !customerId || !serviceId} onClick={submit} className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50">
          {saving ? "Creating..." : "Create Job"}
        </button>
      </div>
    </div>
  );
}
