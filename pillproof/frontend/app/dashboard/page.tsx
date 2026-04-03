'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [batchId, setBatchId] = useState('');
  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTrackData(null);

    try {
      const res = await fetch(`http://localhost:8000/api/batches/track/${batchId}`);
      const data = await res.json();
      if (data.success) {
        setTrackData(data);
      } else {
        setError(data.message || 'Batch not found');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">← Home</Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-2">📊 Track Journey</h1>
          <p className="text-gray-600 mb-8">Track medicine batch through supply chain</p>

          {error && <div className="mb-8 bg-red-50 border-2 border-red-500 rounded-lg p-6"><p className="text-red-700">❌ {error}</p></div>}

          <form onSubmit={handleTrack} className="mb-8 space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Batch ID</label>
              <input type="text" value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="e.g., REG-2024-001" className="w-full px-4 py-2 border-2 border-gray-300 rounded" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 rounded text-lg">
              {loading ? '⏳ Tracking...' : '📍 Track Batch'}
            </button>
          </form>

          {trackData && (
            <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Supply Chain Timeline</h2>
              <div className="space-y-6">
                {trackData.timeline.map((stage, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">{stage.status}</div>
                      {idx < trackData.timeline.length - 1 && <div className="w-1 h-16 bg-blue-300"></div>}
                    </div>
                    <div className="pb-8">
                      <h3 className="text-lg font-bold text-gray-800">{stage.stage}</h3>
                      <p className="text-gray-600">{stage.handler}</p>
                      <p className="text-gray-500 text-sm">{stage.location} • {stage.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
