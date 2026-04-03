"use client";

import { useState } from "react";
import { transferBatch } from "@/lib/api";
import { generateId } from "@/lib/utils";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
import SuccessNotification from "../../components/SuccessNotification";

const STAGES = ["MANUFACTURED", "DISTRIBUTOR", "RETAILER", "SOLD"] as const;

export default function TransferPage() {
  const [form, setForm] = useState({
    batch_id: "",
    from_address: generateId("FROM"),
    to_address: "",
    stage: "DISTRIBUTOR" as typeof STAGES[number],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await transferBatch(form);
      setSuccess(res.message ?? "Transfer recorded successfully!");
      setForm((f) => ({ ...f, batch_id: "", to_address: "" }));
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } }; message?: string };
      setError(err?.response?.data?.detail ?? err?.message ?? "Transfer failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">🔄 Supply Chain Transfer</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Record a batch transfer to the next entity in the supply chain.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessNotification message={success} onDismiss={() => setSuccess(null)} />}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Batch ID *</label>
          <input name="batch_id" value={form.batch_id} onChange={handleChange} required
            placeholder="e.g. BATCH-001"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">From Address *</label>
          <input name="from_address" value={form.from_address} onChange={handleChange} required
            placeholder="Sender Algorand address"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">To Address *</label>
          <input name="to_address" value={form.to_address} onChange={handleChange} required
            placeholder="Recipient Algorand address"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">New Stage *</label>
          <select name="stage" value={form.stage} onChange={handleChange}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
          {loading ? "Processing…" : "🔄 Record Transfer"}
        </button>
      </form>

      {loading && <LoadingSpinner message="Recording on Algorand…" />}
    </div>
  );
}
