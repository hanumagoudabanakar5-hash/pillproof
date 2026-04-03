"use client";

import { useState } from "react";
import { raiseAlert } from "@/lib/api";
import { generateId } from "@/lib/utils";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import SuccessNotification from "../components/SuccessNotification";

const ALERT_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export default function AlertPage() {
  const [form, setForm] = useState({
    batch_id: "",
    alert_level: "HIGH" as typeof ALERT_LEVELS[number],
    reported_location: "",
    reporter_address: generateId("REPORTER"),
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
      const res = await raiseAlert(form);
      setSuccess(res.message ?? "Alert raised successfully!");
      setForm((f) => ({ ...f, batch_id: "", reported_location: "" }));
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } }; message?: string };
      setError(err?.response?.data?.detail ?? err?.message ?? "Failed to raise alert");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">🚨 Raise Counterfeit Alert</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Report a suspected counterfeit medicine batch. CDSCO will be notified.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessNotification message={success} onDismiss={() => setSuccess(null)} />}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Batch ID *</label>
          <input name="batch_id" value={form.batch_id} onChange={handleChange} required
            placeholder="e.g. BATCH-001"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Alert Level *</label>
          <select name="alert_level" value={form.alert_level} onChange={handleChange}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
            {ALERT_LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Reported Location *</label>
          <input name="reported_location" value={form.reported_location} onChange={handleChange} required
            placeholder="e.g. Mumbai, Maharashtra"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Reporter Address</label>
          <input name="reporter_address" value={form.reporter_address} onChange={handleChange} required
            placeholder="Algorand wallet address"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
          {loading ? "Submitting…" : "🚨 Raise Alert"}
        </button>
      </form>

      {loading && <LoadingSpinner message="Submitting alert to blockchain…" />}
    </div>
  );
}
