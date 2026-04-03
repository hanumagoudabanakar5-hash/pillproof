'use client';

import Header from '@/app/components/Header';
import { useState } from 'react';

export default function SupplyChainTransfer() {
  const [formData, setFormData] = useState({
    batchId: '',
    fromLocation: '',
    toLocation: '',
    quantity: '',
    transportMethod: 'Road',
    estimatedDate: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeTransfers, setActiveTransfers] = useState([
    {
      id: 1,
      batchId: 'REG-2024-001',
      from: 'Manufacturer Warehouse',
      to: 'Regional Distributor',
      quantity: '10,000 units',
      status: 'In Transit',
      progress: 65,
      date: '2024-04-03',
    },
    {
      id: 2,
      batchId: 'REG-2024-002',
      from: 'Regional Distributor',
      to: 'City Pharmacy',
      quantity: '5,000 units',
      status: 'In Transit',
      progress: 45,
      date: '2024-04-04',
    },
    {
      id: 3,
      batchId: 'VER-2024-045',
      from: 'Central Warehouse',
      to: 'Distributor',
      quantity: '8,000 units',
      status: 'Delivered',
      progress: 100,
      date: '2024-04-02',
    },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Transfer submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        batchId: '',
        fromLocation: '',
        toLocation: '',
        quantity: '',
        transportMethod: 'Road',
        estimatedDate: '',
        notes: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Supply Chain Transfer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Initiate and track medicine batch transfers between supply chain partners
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transfer Form */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Initiate Transfer</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-lg">
                <p className="text-green-700 dark:text-green-300 font-semibold text-sm">✅ Transfer initiated successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Batch ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Batch ID *
                </label>
                <input
                  type="text"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  placeholder="e.g., REG-2024-001"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                />
              </div>

              {/* From Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  From Location *
                </label>
                <input
                  type="text"
                  name="fromLocation"
                  value={formData.fromLocation}
                  onChange={handleChange}
                  placeholder="e.g., Manufacturer"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                />
              </div>

              {/* To Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To Location *
                </label>
                <input
                  type="text"
                  name="toLocation"
                  value={formData.toLocation}
                  onChange={handleChange}
                  placeholder="e.g., Distributor"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity (units) *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g., 10000"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                />
              </div>

              {/* Transport Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Transport Method *
                </label>
                <select
                  name="transportMethod"
                  value={formData.transportMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                >
                  <option value="Road">🚚 Road</option>
                  <option value="Air">✈️ Air</option>
                  <option value="Sea">🚢 Sea</option>
                  <option value="Rail">🚂 Rail</option>
                </select>
              </div>

              {/* Estimated Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estimated Delivery *
                </label>
                <input
                  type="date"
                  name="estimatedDate"
                  value={formData.estimatedDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                >
                  🚚 Create Transfer
                </button>
                <button
                  type="reset"
                  className="w-full bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                >
                  🔄 Clear
                </button>
              </div>
            </form>
          </div>

          {/* Active Transfers */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Active Transfers</h2>

            <div className="space-y-4">
              {activeTransfers.map((transfer) => (
                <div key={transfer.id} className="p-6 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{transfer.batchId}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{transfer.date}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        transfer.status === 'Delivered'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      {transfer.status}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{transfer.from}</span>
                    <span className="text-lg">→</span>
                    <span>{transfer.to}</span>
                  </div>

                  {/* Quantity */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Quantity: <span className="font-semibold text-gray-900 dark:text-white">{transfer.quantity}</span></p>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          transfer.status === 'Delivered'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${transfer.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{transfer.progress}% Complete</p>
                  </div>

                  {/* Action Button */}
                  <button className="mt-4 w-full px-4 py-2 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 transition font-semibold text-sm">
                    📍 Track Transfer
                  </button>
                </div>
              ))}
            </div>

            {/* Transfer Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">3</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Transfers</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">1</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">2</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">In Transit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-amber-50 dark:bg-amber-900 rounded-xl shadow-lg p-6 border border-amber-200 dark:border-amber-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">📋 Transfer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-semibold">✓ Real-time Tracking</p>
              <p className="text-xs">Monitor transfers on the blockchain in real-time</p>
            </div>
            <div>
              <p className="font-semibold">✓ Secure Handover</p>
              <p className="text-xs">Digital signatures confirm transfers between parties</p>
            </div>
            <div>
              <p className="font-semibold">✓ Temperature Monitoring</p>
              <p className="text-xs">IoT sensors track storage conditions during transit</p>
            </div>
            <div>
              <p className="font-semibold">✓ Audit Trail</p>
              <p className="text-xs">Complete history of all transfers on blockchain</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}