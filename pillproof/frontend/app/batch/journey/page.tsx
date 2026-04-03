"use client";

import { useState } from "react";
import { getBatchJourney } from "@/lib/api";
import type { BatchJourney } from "@/lib/types";
import { formatTimestamp, truncateAddress, stageLabel } from "@/lib/utils";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";

export default function JourneyPage() {
  const [batchId, setBatchId] = useState("");
  const [journey, setJourney] = useState<BatchJourney | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFetch() {
    const trimmed = batchId.trim();
    if (!trimmed) return;
    setError(null);
    setJourney(null);
    setLoading(true);
    try {
      const res = await getBatchJourney(trimmed);
      setJourney(res);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } }; message?: string };
      setError(err?.response?.data?.detail ?? err?.message ?? "Failed to fetch journey");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">🗺️ Track Supply Chain Journey</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          View the complete supply chain history of a medicine batch.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      <div className="flex gap-2">
        <input
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          placeholder="Enter Batch ID…"
          className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleFetch}
          disabled={loading || !batchId.trim()}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Track
        </button>
      </div>

      {loading && <LoadingSpinner message="Fetching supply chain journey…" />}

      {journey && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {journey.medicine_name}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Batch ID: {journey.batch_id} · Current Stage: {stageLabel(journey.current_stage)} · {journey.total_transfers} transfer(s)
            </p>
          </div>

          {journey.total_transfers === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No transfers recorded yet.</p>
          ) : (
            <ol className="relative border-l border-zinc-300 dark:border-zinc-600 space-y-6 pl-6">
              {journey.journey.map((step, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full ring-2 ring-white dark:ring-zinc-900 text-xs font-bold text-blue-700 dark:text-blue-300">
                    {i + 1}
                  </span>
                  <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 ml-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                        {stageLabel(step.stage)}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {formatTimestamp(step.timestamp)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <div>
                        <span className="text-zinc-400">From: </span>
                        <span className="font-mono">{truncateAddress(step.from, 8)}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">To: </span>
                        <span className="font-mono">{truncateAddress(step.to, 8)}</span>
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                      🔗 {step.blockchain}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
