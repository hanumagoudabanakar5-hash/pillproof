'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function QRScannerPage() {
  const [batchId, setBatchId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQrCode('');

    try {
      if (!batchId) {
        setError('Please enter a batch ID');
        return;
      }

      // Generate QR code using qr-server API
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(batchId)}`;
      setQrCode(qrUrl);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">← Home</Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-2">📱 QR Scanner</h1>
          <p className="text-gray-600 mb-8">Generate and scan batch QR codes</p>

          {error && <div className="mb-8 bg-red-50 border-2 border-red-500 rounded-lg p-6"><p className="text-red-700">❌ {error}</p></div>}

          <form onSubmit={handleGenerate} className="mb-8 space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Batch ID</label>
              <input type="text" value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="e.g., REG-2024-001" className="w-full px-4 py-2 border-2 border-gray-300 rounded" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 rounded text-lg">
              {loading ? '⏳ Generating...' : '📱 Generate QR Code'}
            </button>
          </form>

          {qrCode && (
            <div className="text-center bg-gray-50 p-8 rounded-lg border-2 border-gray-300">
              <p className="text-gray-700 font-semibold mb-4">Batch ID: {batchId}</p>
              <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
              <a href={qrCode} download="qr-code.png" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
                ⬇️ Download QR Code
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
