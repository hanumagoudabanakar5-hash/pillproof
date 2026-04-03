'use client';

import Header from '@/app/components/Header';
import { useState } from 'react';

export default function RaiseAlert() {
  const [formData, setFormData] = useState({
    alertType: 'Counterfeit Detection',
    batchId: '',
    severity: 'high',
    description: '',
    location: '',
    reporterName: '',
    reporterEmail: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Alert submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        alertType: 'Counterfeit Detection',
        batchId: '',
        severity: 'high',
        description: '',
        location: '',
        reporterName: '',
        reporterEmail: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Raise Alert
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Report suspicious medicine batches or supply chain issues
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          {submitted && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-lg">
              <p className="text-green-700 dark:text-green-300 font-semibold">✅ Alert submitted successfully! Our team will review it shortly.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alert Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alert Type *
              </label>
              <select
                name="alertType"
                value={formData.alertType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
              >
                <option value="Counterfeit Detection">Counterfeit Detection</option>
                <option value="Temperature Breach">Temperature Breach</option>
                <option value="Expiry Warning">Expiry Warning</option>
                <option value="Contamination Alert">Contamination Alert</option>
                <option value="Storage Issue">Storage Issue</option>
                <option value="Packaging Damage">Packaging Damage</option>
                <option value="Missing Documentation">Missing Documentation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Batch ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Affected Batch ID *
              </label>
              <input
                type="text"
                name="batchId"
                value={formData.batchId}
                onChange={handleChange}
                placeholder="e.g., REG-2024-001"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
              />
            </div>

            {/* Severity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Severity Level *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="severity"
                    value="low"
                    checked={formData.severity === 'low'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Low</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="severity"
                    value="medium"
                    checked={formData.severity === 'medium'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Medium</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="severity"
                    value="high"
                    checked={formData.severity === 'high'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">High</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="severity"
                    value="critical"
                    checked={formData.severity === 'critical'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Critical</span>
                </label>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location Where Issue Found *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York Pharmacy"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
              ></textarea>
            </div>

            {/* Reporter Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
              />
            </div>

            {/* Reporter Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Email *
              </label>
              <input
                type="email"
                name="reporterEmail"
                value={formData.reporterEmail}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
              />
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
              >
                🚨 Submit Alert
              </button>
              <button
                type="reset"
                className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
              >
                🔄 Clear Form
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-6 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">⚠️ Important Information</h3>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>✓ All reports are treated confidentially</li>
              <li>✓ You will receive updates on your email</li>
              <li>✓ Critical alerts trigger immediate investigation</li>
              <li>✓ False reports may result in penalties</li>
              <li>✓ Your identity is protected in the system</li>
            </ul>
          </div>

          {/* Alert Types Info */}
          <div className="mt-8 p-6 bg-orange-50 dark:bg-orange-900 rounded-lg border border-orange-200 dark:border-orange-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">📋 Alert Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <p className="font-semibold">🔴 Counterfeit Detection</p>
                <p className="text-xs">Suspected fake or unauthorized product</p>
              </div>
              <div>
                <p className="font-semibold">🌡️ Temperature Breach</p>
                <p className="text-xs">Storage temperature exceeded limits</p>
              </div>
              <div>
                <p className="font-semibold">📅 Expiry Warning</p>
                <p className="text-xs">Product near or past expiration date</p>
              </div>
              <div>
                <p className="font-semibold">⚗️ Contamination Alert</p>
                <p className="text-xs">Suspected contamination or damage</p>
              </div>
              <div>
                <p className="font-semibold">📦 Storage Issue</p>
                <p className="text-xs">Improper storage conditions found</p>
              </div>
              <div>
                <p className="font-semibold">💔 Packaging Damage</p>
                <p className="text-xs">Package is damaged or tampered</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}