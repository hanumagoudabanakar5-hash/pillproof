"use client";

import { useState } from "react";
import { verifyBatch } from "@/lib/api";
import type { BatchVerifyResult } from "@/lib/types";
import { formatDate, truncateAddress } from "@/lib/utils";
import QRScanner from "../../components/QRScanner";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";

export default function VerifyBatchPage() {
  const [batchId, setBatchId] = useState("");
  const [result, setResult] = useState<BatchVerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify(id: string) {
    const trimmed = id.trim();
    if (!trimmed) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await verifyBatch(trimmed);
      setResult(res);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } }; message?: string };
      setError(err?.response?.data?.detail ?? err?.message ?? "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  function handleQrResult(text: string) {
    try {
      const parsed = JSON.parse(text);
      const id = parsed.batch_id ?? text;
      setBatchId(id);
      handleVerify(id);
    } catch {
      setBatchId(text);
      handleVerify(text);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">🔍 Verify Medicine Batch</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Scan a QR code or enter a batch ID to verify its authenticity.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {/* QR Scanner */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
        <QRScanner onResult={handleQrResult} />
      </div>

      {/* Manual entry */}
      <div className="flex gap-2">
        <input
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          placeholder="Enter Batch ID manually…"
          className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleVerify(batchId)}
          disabled={loading || !batchId.trim()}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Verify
        </button>
      </div>

      {loading && <LoadingSpinner message="Verifying on Algorand…" />}

      {/* Result */}
      {result && (
        <div className={`rounded-xl border p-6 space-y-4 ${
          result.is_genuine
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{result.is_genuine ? "✅" : "❌"}</span>
            <div>
              <p className={`text-xl font-bold ${result.is_genuine ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                {result.status}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Batch ID: {result.batch_id}</p>
            </div>
          </div>

          {result.medicine_name && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {[
                { label: "Medicine", value: result.medicine_name },
                { label: "Manufacturer", value: truncateAddress(result.manufacturer ?? "", 8) },
                { label: "Manufactured", value: formatDate(result.manufacture_date ?? "") },
                { label: "Expires", value: formatDate(result.expiry_date ?? "") },
                { label: "Stage", value: result.current_stage ?? "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-zinc-500 dark:text-zinc-400">{label}</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {result.message && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{result.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
