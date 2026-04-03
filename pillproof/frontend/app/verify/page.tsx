'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VerifyPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState({});

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/batches');
      const data = await res.json();
      if (data.success) setBatches(data.batches);
      else setError('Failed to load batches');
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (batchId) => {
    try {
      setVerifying(prev => ({ ...prev, [batchId]: true }));
      const res = await fetch(`http://localhost:8000/api/batches/verify/${batchId}`);
      const data = await res.json();
      if (data.success) fetchBatches();
      else setError(data.message);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setVerifying(prev => ({ ...prev, [batchId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">← Home</Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-2">✅ Verify Batches</h1>
          <p className="text-gray-600 mb-8">Verify medicine batches on blockchain</p>

          {error && <div className="mb-8 bg-red-50 border-2 border-red-500 rounded-lg p-6"><p className="text-red-700">❌ {error}</p></div>}

          {loading && <p className="text-center text-xl">⏳ Loading batches...</p>}

          {!loading && batches.length === 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 text-center">
              <p className="text-yellow-700 text-lg">📭 No batches yet. <Link href="/register" className="text-blue-600 font-semibold">Register one</Link></p>
            </div>
          )}

          {!loading && batches.length > 0 && (
            <div className="space-y-4">
              {batches.map((batch) => (
                <div key={batch.batchId} className={`border-2 rounded-lg p-6 ${batch.status === 'Verified' ? 'bg-green-50 border-green-400' : 'bg-yellow-50 border-yellow-400'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 font-semibold">Batch ID:</p>
                      <p className="text-lg font-mono text-blue-700">{batch.batchId}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Medicine:</p>
                      <p className="text-lg">{batch.medicineName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Manufacturer:</p>
                      <p className="text-lg">{batch.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Status:</p>
                      <span className={`inline-block px-4 py-1 rounded-full font-semibold text-white ${batch.status === 'Verified' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                        {batch.status}
                      </span>
                    </div>
                  </div>

                  {batch.status !== 'Verified' && (
                    <button onClick={() => handleVerify(batch.batchId)} disabled={verifying[batch.batchId]} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 rounded">
                      {verifying[batch.batchId] ? '⏳ Verifying...' : '✅ Verify Batch'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
