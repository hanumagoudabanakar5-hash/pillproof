'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    medicineName: '',
    manufacturer: '',
    quantity: '',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('http://localhost:8000/api/batches/register', {
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
        setSuccess(true);
        setResponse(data.batch);
        setFormData({ medicineName: '', manufacturer: '', quantity: '', expiryDate: '' });
      } else {
        setError(data.message || 'Registration failed');
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
          <h1 className="text-4xl font-bold mb-2">💊 Register Medicine Batch</h1>
          <p className="text-gray-600 mb-8">Add a new batch to the blockchain</p>

          {success && response && (
            <div className="mb-8 bg-green-50 border-2 border-green-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Success!</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Batch ID:</strong> {response.batchId}</p>
                <p><strong>Medicine:</strong> {response.medicineName}</p>
                <p><strong>Manufacturer:</strong> {response.manufacturer}</p>
                <p><strong>Quantity:</strong> {response.quantity}</p>
                <p><strong>Expiry:</strong> {response.expiryDate}</p>
                <p><strong>Status:</strong> {response.status}</p>
                <p><strong>Hash:</strong> {response.blockchainHash}</p>
              </div>
              <button onClick={() => setSuccess(false)} className="mt-6 bg-blue-600 text-white py-2 px-6 rounded">Register Another</button>
            </div>
          )}

          {error && <div className="mb-8 bg-red-50 border-2 border-red-500 rounded-lg p-6"><p className="text-red-700">❌ {error}</p></div>}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
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
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded text-lg">
                {loading ? '⏳ Registering...' : '✅ Register Batch'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
