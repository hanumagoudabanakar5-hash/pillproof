'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VerifyPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState({});
  const [verifiedBatches, setVerifiedBatches] = useState(new Set());

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/py/batches');
      const data = await response.json();

      if (data.success && data.batches) {
        setBatches(data.batches);
      } else {
        setError('Failed to fetch batches');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (batchId) => {
    try {
      setVerifying(prev => ({ ...prev, [batchId]: true }));

      const response = await fetch(`/api/py/batches/verify/${batchId}`, {
        method: 'GET'
      });

      const data = await response.json();

      if (data.success) {
        setVerifiedBatches(prev => new Set([...prev, batchId]));
        // Refresh batches
        fetchBatches();
      } else {
        setError(data.message || 'Failed to verify batch');
      }
    } catch (err) {
      console.error('Verify error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setVerifying(prev => ({ ...prev, [batchId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
            ← Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-2 text-gray-800">✅ Verify Batches</h1>
          <p className="text-gray-600 mb-8">Verify medicine batches on the blockchain</p>

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-red-50 border-2 border-red-500 rounded-lg p-6">
              <p className="text-red-700 font-semibold">❌ {error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">⏳ Loading batches...</p>
            </div>
          )}

          {/* No Batches */}
          {!loading && batches.length === 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 text-center">
              <p className="text-yellow-700 text-lg font-semibold">📭 No batches registered yet</p>
              <p className="text-yellow-600 mt-2">
                <Link href="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Register a batch first
                </Link>
              </p>
            </div>
          )}

          {/* Batches List */}
          {!loading && batches.length > 0 && (
            <div className="space-y-4">
              {batches.map((batch) => (
                <div
                  key={batch.batchId}
                  className={`border-2 rounded-lg p-6 ${
                    batch.status === 'Verified'
                      ? 'bg-green-50 border-green-400'
                      : 'bg-yellow-50 border-yellow-400'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 font-semibold">Batch ID:</p>
                      <p className="text-lg font-mono text-blue-700">{batch.batchId}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Medicine:</p>
                      <p className="text-lg text-gray-800">{batch.medicineName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Manufacturer:</p>
                      <p className="text-lg text-gray-800">{batch.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Quantity:</p>
                      <p className="text-lg text-gray-800">{batch.quantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Expiry Date:</p>
                      <p className="text-lg text-gray-800">{batch.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Status:</p>
                      <span
                        className={`inline-block px-4 py-1 rounded-full font-semibold ${
                          batch.status === 'Verified'
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-500 text-white'
                        }`}
                      >
                        {batch.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 font-semibold">Blockchain Hash:</p>
                    <p className="text-sm font-mono text-gray-700 break-all bg-gray-100 p-2 rounded">
                      {batch.blockchainHash}
                    </p>
                  </div>

                  {batch.status !== 'Verified' && (
                    <button
                      onClick={() => handleVerify(batch.batchId)}
                      disabled={verifying[batch.batchId]}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
                    >
                      {verifying[batch.batchId] ? '⏳ Verifying...' : '✅ Verify Batch'}
                    </button>
                  )}

                  {batch.status === 'Verified' && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center font-semibold">
                      ✅ This batch is verified on the blockchain
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Refresh Button */}
          <div className="mt-8 text-center">
            <button
              onClick={fetchBatches}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
