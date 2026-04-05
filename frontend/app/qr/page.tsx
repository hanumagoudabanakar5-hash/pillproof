'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const API = 'http://localhost:8000';

interface Batch {
  batchId: string;
  medicineName: string;
  manufacturer: string;
  quantity: number;
  expiryDate: string;
  status: string;
}

export default function QRPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch(`${API}/api/batches`)
      .then((r) => r.json())
      .then((d) => setBatches(d.batches || []))
      .catch(() => {});
  }, []);

  async function generateQR() {
    const text = selectedBatchId
      ? `PillProof Batch: ${selectedBatchId}` + (customText ? ` | ${customText}` : '')
      : customText;

    if (!text.trim()) {
      setError('Please select a batch or enter custom text.');
      return;
    }

    setError('');
    setLoading(true);
    setQrDataUrl('');

    try {
      // Dynamically import qrcode so it only runs in the browser
      const QRCode = (await import('qrcode')).default;
      const dataUrl = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: { dark: '#1e3a8a', light: '#ffffff' },
      });
      setQrDataUrl(dataUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'QR generation failed');
    } finally {
      setLoading(false);
    }
  }

  function downloadQR() {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `pillproof-qr-${selectedBatchId || 'custom'}.png`;
    a.click();
  }

  const selectedBatch = batches.find((b) => b.batchId === selectedBatchId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to Home</Link>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">QR Code Generator</h1>
        <p className="text-slate-500 mt-1">Generate a scannable QR code for any registered batch.</p>
      </div>

      {/* Generator form */}
      <div className="bg-white rounded-2xl shadow p-8 border border-slate-100 space-y-5">
        {/* Batch selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Select Batch (optional)
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => { setSelectedBatchId(e.target.value); setError(''); setQrDataUrl(''); }}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">— choose a batch —</option>
            {batches.map((b) => (
              <option key={b.batchId} value={b.batchId}>
                {b.batchId} — {b.medicineName}
              </option>
            ))}
          </select>
        </div>

        {/* Batch details preview */}
        {selectedBatch && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-1">
            <p><span className="text-slate-500">Medicine:</span> <span className="font-medium">{selectedBatch.medicineName}</span></p>
            <p><span className="text-slate-500">Manufacturer:</span> <span className="font-medium">{selectedBatch.manufacturer}</span></p>
            <p><span className="text-slate-500">Status:</span> <span className={`font-medium ${selectedBatch.status === 'Verified' ? 'text-green-700' : 'text-amber-700'}`}>{selectedBatch.status}</span></p>
            <p><span className="text-slate-500">Expiry:</span> <span className="font-medium">{selectedBatch.expiryDate}</span></p>
          </div>
        )}

        {/* Custom text */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Custom Text / URL (optional)
          </label>
          <input
            type="text"
            value={customText}
            onChange={(e) => { setCustomText(e.target.value); setError(''); setQrDataUrl(''); }}
            placeholder="e.g. https://pillproof.example.com/verify"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            ❌ {error}
          </div>
        )}

        <button
          onClick={generateQR}
          disabled={loading}
          className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-60 transition-colors"
        >
          {loading ? '⏳ Generating…' : '📱 Generate QR Code'}
        </button>
      </div>

      {/* QR result */}
      {qrDataUrl && (
        <div className="bg-white rounded-2xl shadow p-8 border border-slate-100 text-center space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Your QR Code</h2>
          {/* Hidden canvas used by qrcode library */}
          <canvas ref={canvasRef} className="hidden" />
          <img
            src={qrDataUrl}
            alt="QR Code"
            className="mx-auto rounded-xl border border-slate-200 shadow"
            width={300}
            height={300}
          />
          {selectedBatch && (
            <p className="text-sm text-slate-600">
              Batch <span className="font-mono font-medium">{selectedBatch.batchId}</span> —{' '}
              {selectedBatch.medicineName}
            </p>
          )}
          <button
            onClick={downloadQR}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            ⬇️ Download PNG
          </button>
        </div>
      )}

      {/* All batches quick list */}
      {batches.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-3">All Batches</h2>
          <div className="flex flex-wrap gap-2">
            {batches.map((b) => (
              <button
                key={b.batchId}
                onClick={() => { setSelectedBatchId(b.batchId); setQrDataUrl(''); setError(''); }}
                className={`text-xs px-3 py-2 rounded-full border transition-colors ${
                  selectedBatchId === b.batchId
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-blue-50'
                }`}
              >
                {b.batchId}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
