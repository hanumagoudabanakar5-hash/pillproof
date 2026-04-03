'use client';

import Header from '@/app/components/Header';
import { useState } from 'react';

export default function VerifyBatch() {
  const [batchId, setBatchId] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    batchId: string;
    medicineName: string;
    manufacturer: string;
    quantity: string;
    expiryDate: string;
    registeredDate: string;
    status: string;
  } | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!batchId.trim()) {
      setError('Please enter a batch ID');
      return;
    }

    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      
      const mockResults: { [key: string]: typeof verificationResult } = {
        'REG-2024-001': {
          isValid: true,
          batchId: 'REG-2024-001',
          medicineName: 'Aspirin',
          manufacturer: 'Pharma Corp Ltd',
          quantity: '10,000 units',
          expiryDate: '2025-12-31',
          registeredDate: '2024-04-01',
          status: 'Verified ✓',
        },
        'REG-2024-002': {
          isValid: true,
          batchId: 'REG-2024-002',
          medicineName: 'Paracetamol',
          manufacturer: 'Health Pharma Inc',
          quantity: '5,000 units',
          expiryDate: '2025-06-30',
          registeredDate: '2024-04-02',
          status: 'Verified ✓',
        },
        'FAKE-001': {
          isValid: false,
          batchId: 'FAKE-001',
          medicineName: 'Unknown',
          manufacturer: 'Unknown',
          quantity: 'N/A',
          expiryDate: 'N/A',
          registeredDate: 'N/A',
          status: 'Counterfeit ✗',
        },
      };

      const result = mockResults[batchId] || {
        isValid: false,
        batchId: batchId,
        medicineName: 'Not Found',
        manufacturer: 'Not Found',
        quantity: 'N/A',
        expiryDate: 'N/A',
        registeredDate: 'N/A',
        status: 'Not in Database ✗',
      };

      setVerificationResult(result);
    }, 2000);
  };

  const handleReset = () => {
    setBatchId('');
    setVerificationResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Verify Batch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Check if a medicine batch is authentic and registered on the blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Verification Form */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Scan or Enter Batch ID</h2>

            <form onSubmit={handleVerify} className="space-y-4">
              {/* Camera Button */}
              <button
                type="button"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-lg font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                📱 Start QR Scanner
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">OR</span>
                </div>
              </div>

              {/* Batch ID Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter Batch ID
                </label>
                <input
                  type="text"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  placeholder="e.g., REG-2024-001"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">⚠️ {error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isScanning}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                >
                  {isScanning ? '🔍 Verifying...' : '✓ Verify Batch'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                >
                  🔄 Clear
                </button>
              </div>

              {/* Example Batch IDs */}
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Try these examples:</p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• REG-2024-001 (Valid)</li>
                  <li>• REG-2024-002 (Valid)</li>
                  <li>• FAKE-001 (Counterfeit)</li>
                </ul>
              </div>
            </form>
          </div>

          {/* Verification Result */}
          <div className="lg:col-span-2">
            {verificationResult ? (
              <div className={`rounded-xl shadow-lg p-8 ${
                verificationResult.isValid
                  ? 'bg-green-50 dark:bg-green-900 border-2 border-green-400 dark:border-green-600'
                  : 'bg-red-50 dark:bg-red-900 border-2 border-red-400 dark:border-red-600'
              }`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`text-5xl ${verificationResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {verificationResult.isValid ? '✅' : '❌'}
                  </div>
                  <div>
                    <h3 className={`text-3xl font-bold ${verificationResult.isValid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                      {verificationResult.status}
                    </h3>
                    <p className={verificationResult.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {verificationResult.isValid ? 'Authentic medicine batch' : 'Counterfeit or unregistered batch'}
                    </p>
                  </div>
                </div>

                {verificationResult.isValid && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Batch ID</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{verificationResult.batchId}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Medicine</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{verificationResult.medicineName}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Manufacturer</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{verificationResult.manufacturer}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Quantity</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{verificationResult.quantity}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Expiry Date</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{verificationResult.expiryDate}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Registered Date</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{verificationResult.registeredDate}</p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Blockchain Status</p>
                      <p className="text-green-600 dark:text-green-400 font-semibold">✓ Confirmed on Algorand blockchain</p>
                    </div>
                  </div>
                )}

                {!verificationResult.isValid && (
                  <div className="space-y-3">
                    <p className="text-red-700 dark:text-red-300 font-semibold">
                      This batch is NOT registered in the system.
                    </p>
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      ⚠️ WARNING: This could be a counterfeit product. Do not use this medicine. Report it immediately.
                    </p>
                    <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Entered Batch ID</p>
                      <p className="font-bold text-gray-900 dark:text-white">{verificationResult.batchId}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ready to Verify</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter a batch ID or scan a QR code to verify the medicine authenticity
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}