"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError(e?.response?.data?.detail ?? e.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: "Total Batches", value: stats.total_batches, icon: "📦", color: "text-blue-600 dark:text-blue-400" },
        { label: "Genuine", value: stats.genuine_batches, icon: "✅", color: "text-green-600 dark:text-green-400" },
        { label: "Counterfeit", value: stats.counterfeit_batches, icon: "❌", color: "text-red-600 dark:text-red-400" },
        { label: "Orders", value: stats.total_orders, icon: "🛒", color: "text-purple-600 dark:text-purple-400" },
        { label: "Alerts", value: stats.total_alerts, icon: "🚨", color: "text-orange-600 dark:text-orange-400" },
        {
          label: "Integrity Rate",
          value: stats.total_batches > 0
            ? `${Math.round((stats.genuine_batches / stats.total_batches) * 100)}%`
            : "N/A",
          icon: "📊",
          color: "text-teal-600 dark:text-teal-400",
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">⚙️ Admin Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          System overview and analytics for PillProof supply chain.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {loading && <LoadingSpinner message="Loading admin data…" />}

      {stats && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {statCards.map((s) => (
              <div key={s.label} className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700 shadow-sm text-center">
                <div className="text-2xl">{s.icon}</div>
                <div className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Batch Distribution */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Batch Distribution</h3>
              <div className="space-y-3">
                {[
                  { label: "Genuine", value: stats.genuine_batches, total: stats.total_batches, color: "bg-green-500" },
                  { label: "Counterfeit", value: stats.counterfeit_batches, total: stats.total_batches, color: "bg-red-500" },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-xs mb-1 text-zinc-600 dark:text-zinc-400">
                      <span>{bar.label}</span>
                      <span>{bar.value} / {bar.total}</span>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${bar.color} rounded-full transition-all`}
                        style={{ width: bar.total > 0 ? `${(bar.value / bar.total) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">System Info</h3>
              <dl className="space-y-3 text-sm">
                {[
                  { label: "Blockchain", value: stats.blockchain },
                  { label: "Database", value: stats.database },
                  { label: "API Status", value: "🟢 Online" },
                  { label: "Total Orders", value: stats.total_orders },
                  { label: "Active Alerts", value: stats.total_alerts },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <dt className="text-zinc-500 dark:text-zinc-400">{label}</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
