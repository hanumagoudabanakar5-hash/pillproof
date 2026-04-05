'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = 'http://localhost:8000';

interface DetectResult {
  batchId: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  issues: string[];
  isCounterfeit: boolean;
  checkedAt: string;
}

interface Batch {
  batchId: string;
  medicineName: string;
}

export default function DetectPage() {
  const [batchId, setBatchId] = useState('');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/api/batches`)
      .then((r) => r.json())
      .then((d) => setBatches(d.batches || []))
      .catch(() => {});
  }, []);

  async function handleDetect(e: React.FormEvent) {
    e.preventDefault();
    if (!batchId.trim()) return setError('Please enter a Batch ID.');
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/batches/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: batchId.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Detection failed');
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error — is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  function riskColor(level: string) {
    if (level === 'High') return 'bg-red-50 border-red-300 text-red-800';
    if (level === 'Medium') return 'bg-amber-50 border-amber-300 text-amber-800';
    return 'bg-green-50 border-green-300 text-green-800';
  }

  function riskBarColor(level: string) {
    if (level === 'High') return 'bg-red-500';
    if (level === 'Medium') return 'bg-amber-400';
    return 'bg-green-500';
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to Home</Link>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">Counterfeit Detection</h1>
        <p className="text-slate-500 mt-1">
          Analyse a batch for risk indicators — expiry, quantity, and verification status.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleDetect}
        className="bg-white rounded-2xl shadow p-8 border border-slate-100 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Batch ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={batchId}
            onChange={(e) => { setBatchId(e.target.value); setError(''); }}
            placeholder="e.g. PILL-2026-00001"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Batch picker */}
        {batches.length > 0 && (
          <div>
            <p className="text-sm text-slate-500 mb-2">Quick-pick:</p>
            <div className="flex flex-wrap gap-2">
              {batches.map((b) => (
                <button
                  key={b.batchId}
                  type="button"
                  onClick={() => { setBatchId(b.batchId); setError(''); }}
                  className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
                >
                  {b.batchId} — {b.medicineName}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            ❌ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-60 transition-colors"
        >
          {loading ? '⏳ Analysing…' : '🔍 Run Detection'}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className={`border rounded-2xl p-6 space-y-4 ${riskColor(result.riskLevel)}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {result.isCounterfeit ? '⚠️ HIGH RISK — Possible Counterfeit' : '🛡️ Analysis Complete'}
            </h2>
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full border ${riskColor(result.riskLevel)}`}
            >
              {result.riskLevel} Risk
            </span>
          </div>

          {/* Risk score bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Risk Score</span>
              <span>{result.riskScore} / 100</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${riskBarColor(result.riskLevel)}`}
                style={{ width: `${Math.min(result.riskScore, 100)}%` }}
              />
            </div>
          </div>

          {/* Issues */}
          {result.issues.length > 0 ? (
            <div>
              <p className="text-sm font-medium mb-2">Issues Found:</p>
              <ul className="space-y-1">
                {result.issues.map((issue, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span>⚠️</span> {issue}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm">✅ No issues found. Batch looks authentic.</p>
          )}

          <p className="text-xs opacity-70">
            Checked at {new Date(result.checkedAt).toLocaleString()}
          </p>

          <div className="flex gap-3 pt-1">
            <Link
              href="/verify"
              className="text-sm bg-white border border-current px-4 py-2 rounded-lg hover:opacity-80"
            >
              Verify Batch
            </Link>
            <Link
              href="/dashboard"
              className="text-sm bg-white border border-current px-4 py-2 rounded-lg hover:opacity-80"
            >
              Track Journey
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
