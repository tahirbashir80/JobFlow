"use client";

import { useState } from "react";

type PaymentFormProps = {
  invoiceId: string;
  balance: number;
  currency: string;
  action: (formData: FormData) => void | Promise<void>;
};

export function PaymentForm({ invoiceId, balance, currency, action }: PaymentFormProps) {
  const [paymentType, setPaymentType] = useState<"FULL" | "PARTIAL">("FULL");
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState(balance.toFixed(2));

  const selectType = (type: "FULL" | "PARTIAL") => {
    setPaymentType(type);
    setAmount(type === "FULL" ? balance.toFixed(2) : "");
  };

  const isCheque = method === "CHEQUE";

  return (
    <form action={action} className="mt-5 space-y-5">
      <input type="hidden" name="paymentType" value={paymentType} />
      <div>
        <p className="text-sm font-medium">Payment type</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className={`cursor-pointer rounded-xl border p-4 ${paymentType === "FULL" ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"}`}>
            <input type="radio" name="paymentTypeUi" value="FULL" checked={paymentType === "FULL"} onChange={() => selectType("FULL")} className="mr-2" />
            <span className="font-semibold">Full payment</span>
            <span className="mt-1 block text-xs text-gray-500">Pay the full outstanding balance.</span>
          </label>
          <label className={`cursor-pointer rounded-xl border p-4 ${paymentType === "PARTIAL" ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"}`}>
            <input type="radio" name="paymentTypeUi" value="PARTIAL" checked={paymentType === "PARTIAL"} onChange={() => selectType("PARTIAL")} className="mr-2" />
            <span className="font-semibold">Partial payment</span>
            <span className="mt-1 block text-xs text-gray-500">Collect less than the outstanding balance.</span>
          </label>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Payment amount · {currency}</label>
        <input
          name="amount"
          type="number"
          min="0.01"
          max={balance.toFixed(2)}
          step="0.01"
          value={amount}
          readOnly={paymentType === "FULL"}
          onChange={(e) => setAmount(e.target.value)}
          required
          className={`mt-1 w-full rounded-lg border px-3 py-2.5 ${paymentType === "FULL" ? "bg-gray-50" : "bg-white"}`}
        />
        <p className="mt-1 text-xs text-gray-500">
          Outstanding balance: {new Intl.NumberFormat(undefined, { style: "currency", currency }).format(balance)}
        </p>
      </div>

      <div>
        <label className="text-sm font-medium">Payment method</label>
        <select name="method" value={method} onChange={(e) => setMethod(e.target.value)} required className="mt-1 w-full rounded-lg border bg-white px-3 py-2.5">
          <option value="">Select payment method</option>
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="BANK_TRANSFER">Bank transfer</option>
          <option value="ONLINE">Online</option>
          <option value="CHEQUE">Cheque</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {isCheque && (
        <div className="rounded-xl border bg-gray-50 p-4">
          <h3 className="font-semibold">Cheque details</h3>
          <p className="mt-1 text-xs text-gray-500">The cheque stays pending until it is cleared.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Cheque number</label>
              <input name="chequeNumber" required={isCheque} className="mt-1 w-full rounded-lg border bg-white px-3 py-2.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Bank</label>
              <input name="chequeBank" className="mt-1 w-full rounded-lg border bg-white px-3 py-2.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Cheque date</label>
              <input name="chequeDate" type="date" className="mt-1 w-full rounded-lg border bg-white px-3 py-2.5" />
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea name="notes" rows={3} placeholder="Optional payment notes" className="mt-1 w-full rounded-lg border px-3 py-2.5" />
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
        <div>
          <p className="text-sm font-semibold">{paymentType === "FULL" ? "Full payment" : "Partial payment"}</p>
          <p className="text-xs text-gray-500">
            {isCheque ? "Cheque will remain pending until cleared." : paymentType === "FULL" ? "Invoice will become paid when the payment succeeds." : "Invoice will remain partially paid."}
          </p>
        </div>
        <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white">
          {paymentType === "FULL" ? "Record full payment" : "Record partial payment"}
        </button>
      </div>
    </form>
  );
}
