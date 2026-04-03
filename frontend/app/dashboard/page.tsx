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
  createdAt: string;
}

interface TimelineStage {
  stage: string;
  status: string;
  timestamp: string | null;
  description: string;
  location: string;
}

export default function DashboardPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [timeline, setTimeline] = useState<TimelineStage[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackLoading, setTrackLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/api/batches`)
      .then((r) => r.json())
      .then((d) => setBatches(d.batches || []))
      .catch(() => setError('Failed to load batches'))
      .finally(() => setLoading(false));
  }, []);

  async function handleTrack(batchId: string) {
    if (!batchId) return;
    setTrackLoading(true);
    setError('');
    setTimeline([]);
    setSelectedBatch(null);

    try {
      const res = await fetch(`${API}/api/batches/${batchId}/track`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Track failed');
      setTimeline(data.timeline);
      setSelectedBatch(data.batch);
      setSelectedBatchId(batchId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setTrackLoading(false);
    }
  }

  function stageIcon(stage: string) {
    const icons: Record<string, string> = {
      Manufacturing: '🏭',
      'Quality Control': '🔬',
      Packaging: '📦',
      Distribution: '🚛',
      Retail: '🏪',
    };
    return icons[stage] || '📍';
  }

  function stageColor(status: string) {
    if (status === 'Completed') return 'bg-green-100 border-green-400 text-green-800';
    if (status === 'In Progress') return 'bg-blue-100 border-blue-400 text-blue-800';
    return 'bg-slate-100 border-slate-300 text-slate-500';
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to Home</Link>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">Supply Chain Dashboard</h1>
        <p className="text-slate-500 mt-1">View all registered batches and track their supply chain journey.</p>
      </div>

      {/* Batches grid */}
      <section>
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Registered Batches</h2>
        {loading ? (
          <p className="text-slate-400">Loading batches…</p>
        ) : batches.length === 0 ? (
          <div className="bg-slate-50 rounded-xl p-8 text-center">
            <p className="text-slate-400 mb-3">No batches yet.</p>
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Register the first batch →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((batch) => (
              <div
                key={batch.batchId}
                className={`bg-white rounded-xl shadow border p-5 space-y-3 card-hover ${
                  selectedBatchId === batch.batchId ? 'border-blue-400 ring-2 ring-blue-200' : 'border-slate-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-slate-500">{batch.batchId}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      batch.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{batch.medicineName}</p>
                  <p className="text-sm text-slate-500">{batch.manufacturer}</p>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-slate-600">
                  <span>Qty: {batch.quantity.toLocaleString()}</span>
                  <span>Exp: {batch.expiryDate}</span>
                </div>
                <button
                  onClick={() => handleTrack(batch.batchId)}
                  className="w-full text-sm bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {trackLoading && selectedBatchId === batch.batchId ? '⏳ Loading…' : '📍 Track Journey'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Timeline */}
      {timeline.length > 0 && selectedBatch && (
        <section className="bg-white rounded-2xl shadow p-8 border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Supply Chain Journey — {selectedBatch.batchId}
              </h2>
              <p className="text-slate-500 text-sm">{selectedBatch.medicineName} by {selectedBatch.manufacturer}</p>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium self-start ${
                selectedBatch.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {selectedBatch.status}
            </span>
          </div>

          {/* Timeline list */}
          <ol className="relative border-l-2 border-slate-200 ml-4 space-y-8">
            {timeline.map((stage, i) => (
              <li key={i} className="ml-6">
                {/* Dot */}
                <span
                  className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full border-2 text-sm ${stageColor(stage.status)}`}
                >
                  {stageIcon(stage.stage)}
                </span>

                <div className={`border rounded-xl p-4 ${stageColor(stage.status)}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-semibold">{stage.stage}</span>
                    <span className="text-xs border rounded-full px-2 py-0.5">
                      {stage.status}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{stage.description}</p>
                  <div className="flex gap-4 mt-2 text-xs opacity-70">
                    <span>📍 {stage.location}</span>
                    {stage.timestamp && (
                      <span>🕒 {new Date(stage.timestamp).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
