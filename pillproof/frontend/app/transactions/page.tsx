"use client";

import { useState } from "react";
import { formatTimestamp } from "@/lib/utils";

interface TxRecord {
  id: string;
  sender: string;
  receiver: string;
  amountAlgo: number;
  status: "CONFIRMED" | "FAILED" | "PENDING";
  note?: string;
  timestamp: string;
}

// Seed with demo data
const DEMO_TRANSACTIONS: TxRecord[] = [
  {
    id: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUV",
    sender: "SENDER7EXAMPLEADDRESS7777777777777777777777777777777777",
    receiver: "RECEIVER7EXAMPLEADDRESS77777777777777777777777777777777",
    amountAlgo: 5.0,
    status: "CONFIRMED",
    note: "Payment for Batch-001",
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: "BCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVW",
    sender: "SENDER7EXAMPLEADDRESS7777777777777777777777777777777777",
    receiver: "SUPPLIER7EXAMPLEADDRESS7777777777777777777777777777777",
    amountAlgo: 2.5,
    status: "CONFIRMED",
    note: "Procurement order ORD-101",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "CDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVWX",
    sender: "SENDER7EXAMPLEADDRESS7777777777777777777777777777777777",
    receiver: "RETAILER7EXAMPLEADDRESS7777777777777777777777777777777",
    amountAlgo: 10.0,
    status: "FAILED",
    note: "Counterfeit detected",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

const STATUS_FILTERS = ["ALL", "CONFIRMED", "PENDING", "FAILED"] as const;

export default function TransactionsPage() {
  const [filter, setFilter] = useState<typeof STATUS_FILTERS[number]>("ALL");
  const [search, setSearch] = useState("");

  const filtered = DEMO_TRANSACTIONS.filter((tx) => {
    if (filter !== "ALL" && tx.status !== filter) return false;
    if (search && !tx.id.toLowerCase().includes(search.toLowerCase()) &&
        !(tx.note ?? "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">📋 Transaction History</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          View all Algorand payment transactions for PillProof.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by TX ID or note…"
          className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filter === s
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No transactions found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Transaction</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Amount</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Note</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Time</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                      {tx.id.slice(0, 16)}…
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {tx.sender.slice(0, 10)}…
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell font-medium text-teal-600 dark:text-teal-400">
                    Ⓐ {tx.amountAlgo.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-zinc-600 dark:text-zinc-400">
                    {tx.note ?? "—"}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-zinc-500 dark:text-zinc-400 text-xs">
                    {formatTimestamp(tx.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      tx.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : tx.status === "FAILED"
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center">
        Showing demo transactions. Connect your wallet to see real Algorand transactions.
      </p>
    </div>
  );
}
