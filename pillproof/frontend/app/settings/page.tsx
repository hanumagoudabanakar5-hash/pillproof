"use client";

import { useState, useEffect } from "react";
import SuccessNotification from "../components/SuccessNotification";

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
  );
  const [walletAddress, setWalletAddress] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clear the success notification and clean up the timeout if the component unmounts
  useEffect(() => {
    if (!saved) return;
    const id = window.setTimeout(() => setSaved(false), 3000);
    return () => window.clearTimeout(id);
  }, [saved]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">⚙️ Settings</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Configure your PillProof preferences, wallet, and API settings.
        </p>
      </div>

      {saved && <SuccessNotification message="Settings saved successfully!" />}

      <form onSubmit={handleSave} className="space-y-6">
        {/* API Settings */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 space-y-4">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">🔗 API Configuration</h2>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Backend API URL
            </label>
            <input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              Set via NEXT_PUBLIC_API_URL environment variable in production.
            </p>
          </div>
        </div>

        {/* Wallet Settings */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 space-y-4">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">👛 Wallet Settings</h2>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Default Wallet Address
            </label>
            <input
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value.toUpperCase())}
              placeholder="Algorand wallet address (58 characters)"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Connected to Algorand Testnet. Get free test ALGO at{" "}
            <a
              href="https://testnet.algoexplorer.io/dispenser"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Testnet Dispenser
            </a>
            .
          </p>
        </div>

        {/* Display Preferences */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 space-y-4">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">🎨 Display Preferences</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-blue-600"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Dark Mode (follows system preference by default)
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
