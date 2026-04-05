'use client';

import { useState } from 'react';
import Link from 'next/link';

const API = 'http://localhost:8000';

interface Batch {
  id: number;
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

export default function RegisterPage() {
  const [form, setForm] = useState({
    medicineName: '',
    manufacturer: '',
    quantity: '',
    expiryDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Batch | null>(null);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResult(null);

    // Client-side validation
    if (!form.medicineName.trim()) return setError('Medicine name is required.');
    if (!form.manufacturer.trim()) return setError('Manufacturer is required.');
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0)
      return setError('Quantity must be a positive number.');
    if (!form.expiryDate) return setError('Expiry date is required.');

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/batches/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Registration failed');
      setResult(data.batch);
      setForm({ medicineName: '', manufacturer: '', quantity: '', expiryDate: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error — is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to Home</Link>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">Register Medicine Batch</h1>
        <p className="text-slate-500 mt-1">Add a new batch to the blockchain-verified supply chain.</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-8 border border-slate-100 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Medicine Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="medicineName"
            value={form.medicineName}
            onChange={handleChange}
            placeholder="e.g. Paracetamol 500mg"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Manufacturer <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="manufacturer"
            value={form.manufacturer}
            onChange={handleChange}
            placeholder="e.g. Sun Pharma Ltd"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quantity (units) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 5000"
              min="1"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            ❌ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '⏳ Registering…' : '📋 Register Batch'}
        </button>
      </form>

      {/* Success result */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-bold text-green-800">✅ Batch Registered Successfully!</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <InfoRow label="Batch ID" value={result.batchId} />
            <InfoRow label="Medicine" value={result.medicineName} />
            <InfoRow label="Manufacturer" value={result.manufacturer} />
            <InfoRow label="Quantity" value={String(result.quantity)} />
            <InfoRow label="Expiry" value={result.expiryDate} />
            <InfoRow label="Status" value={result.status} />
          </div>
          <div className="mt-2">
            <p className="text-xs text-slate-500 font-mono break-all">
              🔗 Hash: {result.blockchainHash}
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <Link
              href={`/verify`}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Verify this batch
            </Link>
            <Link
              href="/dashboard"
              className="text-sm bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      )}
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
