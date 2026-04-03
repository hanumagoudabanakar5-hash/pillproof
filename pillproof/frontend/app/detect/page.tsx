'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DetectPage() {
  const [formData, setFormData] = useState({
    medicineName: '',
    manufacturer: '',
    quantity: '',
    expiryDate: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('http://localhost:8000/api/batches/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineName: formData.medicineName,
          manufacturer: formData.manufacturer,
          quantity: parseInt(formData.quantity),
          expiryDate: formData.expiryDate
        })
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        setError('Analysis failed');
      }
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
          <h1 className="text-4xl font-bold mb-2">🔍 Detect Counterfeit</h1>
          <p className="text-gray-600 mb-8">Analyze batch for authenticity</p>

          {error && <div className="mb-8 bg-red-50 border-2 border-red-500 rounded-lg p-6"><p className="text-red-700">❌ {error}</p></div>}

          {result && (
            <div className={`mb-8 border-2 rounded-lg p-6 ${result.isAuthentic ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${result.isAuthentic ? 'text-green-700' : 'text-red-700'}`}>
                {result.isAuthentic ? '✅ AUTHENTIC' : '❌ COUNTERFEIT'}
              </h2>
              <div className="space-y-2">
                <p><strong>Confidence:</strong> {result.confidence}%</p>
                <p><strong>Risk Score:</strong> {result.riskScore}</p>
                <p><strong>Risk Factors:</strong> {result.riskFactors.length > 0 ? result.riskFactors.join(', ') : 'None'}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleAnalyze} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Medicine Name</label>
              <input type="text" name="medicineName" value={formData.medicineName} onChange={handleChange} placeholder="e.g., Aspirin" required className="w-full px-4 py-2 border-2 border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Manufacturer</label>
              <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} placeholder="e.g., Bayer" required className="w-full px-4 py-2 border-2 border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="e.g., 10000" required className="w-full px-4 py-2 border-2 border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Expiry Date</label>
              <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required className="w-full px-4 py-2 border-2 border-gray-300 rounded" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-3 rounded text-lg">
              {loading ? '⏳ Analyzing...' : '🔍 Analyze'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
