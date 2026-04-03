"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

const quickActions = [
  { label: "Register Batch", href: "/batch/register", icon: "📦", color: "bg-blue-600 hover:bg-blue-700" },
  { label: "Verify Batch", href: "/batch/verify", icon: "🔍", color: "bg-green-600 hover:bg-green-700" },
  { label: "Track Journey", href: "/batch/journey", icon: "🗺️", color: "bg-purple-600 hover:bg-purple-700" },
  { label: "Raise Alert", href: "/alert", icon: "🚨", color: "bg-red-600 hover:bg-red-700" },
  { label: "Transfer", href: "/supply-chain/transfer", icon: "🔄", color: "bg-orange-600 hover:bg-orange-700" },
  { label: "Make Payment", href: "/payment", icon: "💳", color: "bg-teal-600 hover:bg-teal-700" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError(e?.response?.data?.detail ?? e.message ?? "Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          💊 PillProof Dashboard
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Blockchain-powered medicine supply chain — Algorand Testnet
        </p>
      </div>

      {/* Stats */}
      {loading && <LoadingSpinner message="Loading statistics…" />}
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Batches", value: stats.total_batches, icon: "📦", color: "text-blue-600 dark:text-blue-400" },
            { label: "Genuine", value: stats.genuine_batches, icon: "✅", color: "text-green-600 dark:text-green-400" },
            { label: "Counterfeit", value: stats.counterfeit_batches, icon: "❌", color: "text-red-600 dark:text-red-400" },
            { label: "Orders", value: stats.total_orders, icon: "🛒", color: "text-purple-600 dark:text-purple-400" },
            { label: "Alerts", value: stats.total_alerts, icon: "🚨", color: "text-orange-600 dark:text-orange-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700 shadow-sm"
            >
              <div className="text-2xl">{stat.icon}</div>
              <div className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Blockchain badge */}
      {stats && (
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Connected to {stats.blockchain} · Database: {stats.database}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`${action.color} text-white rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-colors shadow-sm`}
            >
              <span className="text-3xl">{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Recent Activity
        </h2>
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-100 dark:divide-zinc-700">
          {[
            { icon: "📦", text: "Batch registered on Algorand Testnet", time: "Just now" },
            { icon: "✅", text: "Batch verified as genuine", time: "2 min ago" },
            { icon: "🔄", text: "Supply chain transfer recorded", time: "10 min ago" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4 text-sm">
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1 text-zinc-700 dark:text-zinc-300">{item.text}</span>
              <span className="text-zinc-400 dark:text-zinc-500 text-xs">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
