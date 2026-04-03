"use client";

import { useState, useCallback } from "react";
import PaymentCalculator from "../components/PaymentCalculator";
import { isValidAlgorandAddress, generateMockTxId } from "@/lib/algorand";
import { formatTimestamp } from "@/lib/utils";
import ErrorAlert from "../components/ErrorAlert";
import SuccessNotification from "../components/SuccessNotification";
import LoadingSpinner from "../components/LoadingSpinner";

interface TxRecord {
  id: string;
  sender: string;
  receiver: string;
  amountAlgo: number;
  note: string;
  status: "CONFIRMED" | "FAILED";
  timestamp: string;
}

export default function PaymentPage() {
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amountAlgo, setAmountAlgo] = useState(0);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [txRecords, setTxRecords] = useState<TxRecord[]>([]);

  const handleAmountChange = useCallback((val: number) => {
    setAmountAlgo(val);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isValidAlgorandAddress(sender)) {
      setError("Invalid sender Algorand address (must be 58 uppercase base32 characters).");
      return;
    }
    if (!isValidAlgorandAddress(receiver)) {
      setError("Invalid receiver Algorand address.");
      return;
    }
    if (amountAlgo <= 0) {
      setError("Please enter an amount greater than 0.");
      return;
    }

    setLoading(true);
    try {
      // Simulate network delay — in production call Algorand SDK
      await new Promise((r) => setTimeout(r, 1500));
      const txId = generateMockTxId();
      setSuccess(`✅ Payment of Ⓐ ${amountAlgo.toFixed(6)} sent! TX: ${txId.slice(0, 12)}…`);
      setTxRecords((prev) => [
        {
          id: txId,
          sender,
          receiver,
          amountAlgo,
          note,
          status: "CONFIRMED",
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNote("");
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err?.message ?? "Payment failed. Please try again.");
      setTxRecords((prev) => [
        {
          id: generateMockTxId(),
          sender,
          receiver,
          amountAlgo,
          note,
          status: "FAILED",
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">💳 Algorand Payment</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Send ALGO payments on Algorand Testnet with automatic currency conversion.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessNotification message={success} onDismiss={() => setSuccess(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 space-y-5">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Payment Details</h2>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Sender Address *</label>
            <input
              value={sender}
              onChange={(e) => setSender(e.target.value.toUpperCase())}
              required
              placeholder="58-character Algorand address"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Receiver Address *</label>
            <input
              value={receiver}
              onChange={(e) => setReceiver(e.target.value.toUpperCase())}
              required
              placeholder="58-character Algorand address"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3 text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Amount: </span>
            <span className="font-bold text-teal-600 dark:text-teal-400">
              Ⓐ {amountAlgo > 0 ? amountAlgo.toFixed(6) : "0.000000"}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Note (optional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Payment for Batch-001"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button type="submit" disabled={loading || amountAlgo <= 0}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
            {loading ? "Processing…" : "Send Payment"}
          </button>
        </form>

        {/* Calculator */}
        <div className="space-y-4">
          <PaymentCalculator onAmountChange={handleAmountChange} />
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">ℹ️ Algorand Testnet</p>
            <p>Payments are processed on the Algorand Testnet. No real funds are transferred.</p>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner message="Processing Algorand payment…" />}

      {/* Recent Transactions */}
      {txRecords.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Recent Transactions</h2>
          <div className="space-y-3">
            {txRecords.slice(0, 5).map((tx) => (
              <div key={tx.id} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 flex items-center gap-4">
                <span className="text-xl">{tx.status === "CONFIRMED" ? "✅" : "❌"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    TX: {tx.id.slice(0, 16)}…
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Ⓐ {tx.amountAlgo.toFixed(6)} · {formatTimestamp(tx.timestamp)}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  tx.status === "CONFIRMED"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}>
                  {tx.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
