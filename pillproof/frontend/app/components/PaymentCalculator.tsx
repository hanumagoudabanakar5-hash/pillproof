"use client";

import { useEffect, useState } from "react";
import { usdToAlgo, inrToAlgo, algoToUsd, algoToInr, fetchAlgoPrice } from "@/lib/algorand";

interface PaymentCalculatorProps {
  onAmountChange?: (amountAlgo: number) => void;
}

type Currency = "USD" | "INR" | "ALGO";

export default function PaymentCalculator({ onAmountChange }: PaymentCalculatorProps) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [amount, setAmount] = useState("");
  const [algoPrice, setAlgoPrice] = useState(0.18);
  const [inrRate, setInrRate] = useState(15.0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAlgoPrice()
      .then((price) => {
        if (cancelled) return;
        setAlgoPrice(price);
        // Approximate INR rate from USD price (1 ALGO ≈ algoPrice USD, 1 USD ≈ 83 INR)
        setInrRate(parseFloat((price * 83).toFixed(4)));
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const numAmount = parseFloat(amount) || 0;

  const algoAmount =
    currency === "ALGO"
      ? numAmount
      : currency === "USD"
      ? usdToAlgo(numAmount, algoPrice)
      : inrToAlgo(numAmount, inrRate);

  const usdEquiv =
    currency === "USD" ? numAmount : algoToUsd(algoAmount, algoPrice);
  const inrEquiv =
    currency === "INR" ? numAmount : algoToInr(algoAmount, inrRate);

  useEffect(() => {
    if (onAmountChange) onAmountChange(algoAmount);
  }, [algoAmount, onAmountChange]);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 space-y-4 border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          💱 Payment Calculator
        </h3>
        {loading ? (
          <span className="text-xs text-zinc-400">Fetching rate…</span>
        ) : (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            1 ALGO ≈ ${algoPrice.toFixed(4)} USD
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {(["USD", "INR", "ALGO"] as Currency[]).map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currency === c
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-500 dark:text-zinc-400 w-10">
          {currency === "USD" ? "$" : currency === "INR" ? "₹" : "Ⓐ"}
        </span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg text-sm bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {numAmount > 0 && (
        <div className="space-y-1 text-sm border-t border-zinc-200 dark:border-zinc-700 pt-3">
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400">ALGO</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Ⓐ {algoAmount.toFixed(6)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400">USD</span>
            <span className="text-zinc-700 dark:text-zinc-300">${usdEquiv.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400">INR</span>
            <span className="text-zinc-700 dark:text-zinc-300">₹{inrEquiv.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
