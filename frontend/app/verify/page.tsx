'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = 'http://localhost:8000';

interface Batch {
  batchId: string;
  medicineName: string;
  manufacturer: string;
  quantity: number;
  expiryDate: string;
  status: string;
  verified: boolean;
  blockchainHash: string;
  verifiedAt?: string;
  createdAt: string;
}

export default function VerifyPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchId, setBatchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingList, setFetchingList] = useState(true);
  const [result, setResult] = useState<Batch | null>(null);
  const [error, setError] = useState('');

  // Load all batches for the dropdown
  useEffect(() => {
    fetch(`${API}/api/batches`)
      .then((r) => r.json())
      .then((d) => setBatches(d.batches || []))
      .catch(() => {})
      .finally(() => setFetchingList(false));
  }, []);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!batchId.trim()) return setError('Please enter or select a Batch ID.');
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/batches/${batchId.trim()}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Verification failed');
      setResult(data.batch);

      // Refresh the list
      const listRes = await fetch(`${API}/api/batches`);
      const listData = await listRes.json();
      setBatches(listData.batches || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error — is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  const unverified = batches.filter((b) => !b.verified);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to Home</Link>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">Verify Medicine Batch</h1>
        <p className="text-slate-500 mt-1">Mark a batch as officially verified on the supply chain.</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleVerify}
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
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quick-pick from unverified batches */}
        {!fetchingList && unverified.length > 0 && (
          <div>
            <p className="text-sm text-slate-500 mb-2">Or pick from unverified batches:</p>
            <div className="flex flex-wrap gap-2">
              {unverified.map((b) => (
                <button
                  key={b.batchId}
                  type="button"
                  onClick={() => { setBatchId(b.batchId); setError(''); }}
                  className="text-xs bg-amber-50 border border-amber-300 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors"
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
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
        >
          {loading ? '⏳ Verifying…' : '✅ Verify Batch'}
        </button>
      </form>

      {/* Success */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-bold text-green-800">✅ Batch Verified Successfully!</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <InfoRow label="Batch ID" value={result.batchId} />
            <InfoRow label="Medicine" value={result.medicineName} />
            <InfoRow label="Status" value={result.status} />
            <InfoRow label="Verified At" value={result.verifiedAt ? new Date(result.verifiedAt).toLocaleString() : '—'} />
          </div>
          <p className="text-xs text-slate-500 font-mono break-all">
            🔗 Hash: {result.blockchainHash}
          </p>
        </div>
      )}

      {/* All Batches table */}
      <section>
        <h2 className="text-xl font-bold text-slate-700 mb-3">All Batches</h2>
        {fetchingList ? (
          <p className="text-slate-400">Loading…</p>
        ) : batches.length === 0 ? (
          <p className="text-slate-400">No batches registered yet. <Link href="/register" className="text-blue-600 hover:underline">Register one</Link>.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Batch ID</th>
                  <th className="px-4 py-3 text-left font-medium">Medicine</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {batches.map((b) => (
                  <tr key={b.batchId}>
                    <td className="px-4 py-3 font-mono text-xs">{b.batchId}</td>
                    <td className="px-4 py-3">{b.medicineName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          b.verified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {!b.verified && (
                        <button
                          onClick={() => { setBatchId(b.batchId); setError(''); }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Select
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-slate-500">{label}: </span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}
