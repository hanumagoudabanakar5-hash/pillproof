'use client';

import Header from '@/app/components/Header';
import { useState } from 'react';

export default function TrackJourney() {
  const [batchId, setBatchId] = useState('');
  const [journeyData, setJourneyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!batchId.trim()) {
      setError('Please enter a batch ID');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const mockJourneys: { [key: string]: any } = {
        'REG-2024-001': {
          batchId: 'REG-2024-001',
          medicineName: 'Aspirin',
          journey: [
            {
              step: 1,
              location: 'Pharma Corp Manufacturer',
              status: 'Registered',
              date: '2024-04-01',
              time: '10:30 AM',
              icon: '🏭',
              completed: true,
            },
            {
              step: 2,
              location: 'Quality Control Lab',
              status: 'Verified',
              date: '2024-04-01',
              time: '2:45 PM',
              icon: '🔬',
              completed: true,
            },
            {
              step: 3,
              location: 'Central Warehouse',
              status: 'In Storage',
              date: '2024-04-02',
              time: '9:15 AM',
              icon: '📦',
              completed: true,
            },
            {
              step: 4,
              location: 'Regional Distributor',
              status: 'In Transit',
              date: '2024-04-03',
              time: '3:20 PM',
              icon: '🚚',
              completed: true,
            },
            {
              step: 5,
              location: 'City Pharmacy',
              status: 'Awaiting Delivery',
              date: '2024-04-05',
              time: 'Est. 10:00 AM',
              icon: '💊',
              completed: false,
            },
          ],
        },
        'REG-2024-002': {
          batchId: 'REG-2024-002',
          medicineName: 'Paracetamol',
          journey: [
            {
              step: 1,
              location: 'Health Pharma Inc',
              status: 'Registered',
              date: '2024-04-02',
              time: '11:00 AM',
              icon: '🏭',
              completed: true,
            },
            {
              step: 2,
              location: 'Quality Control Lab',
              status: 'Verified',
              date: '2024-04-02',
              time: '3:30 PM',
              icon: '🔬',
              completed: true,
            },
            {
              step: 3,
              location: 'Central Warehouse',
              status: 'In Storage',
              date: '2024-04-03',
              time: '8:00 AM',
              icon: '📦',
              completed: true,
            },
            {
              step: 4,
              location: 'City Pharmacy',
              status: 'Delivered',
              date: '2024-04-04',
              time: '2:00 PM',
              icon: '💊',
              completed: true,
            },
          ],
        },
      };

      const data = mockJourneys[batchId];
      if (data) {
        setJourneyData(data);
      } else {
        setError('Batch ID not found');
      }
    }, 1500);
  };

  const handleReset = () => {
    setBatchId('');
    setJourneyData(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Track Journey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Follow the complete supply chain journey of your medicine batch
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Batch ID to Track
              </label>
              <input
                type="text"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="e.g., REG-2024-001"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">⚠️ {error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
              >
                {isLoading ? '📍 Tracking...' : '📍 Track Journey'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
              >
                🔄 Clear
              </button>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg border border-purple-200 dark:border-purple-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Try these examples:</p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• REG-2024-001 (In Transit)</li>
                <li>• REG-2024-002 (Delivered)</li>
              </ul>
            </div>
          </form>
        </div>

        {journeyData ? (
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Batch ID</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{journeyData.batchId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Medicine</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{journeyData.medicineName}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Supply Chain Journey</h2>

              <div className="space-y-8">
                {journeyData.journey.map((step: any, index: number) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                          step.completed
                            ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                            : 'bg-yellow-400 text-white'
                        }`}
                      >
                        {step.icon}
                      </div>
                      {index < journeyData.journey.length - 1 && (
                        <div
                          className={`w-1 h-24 mt-2 ${
                            journeyData.journey[index + 1].completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        ></div>
                      )}
                    </div>

                    <div className="flex-1 pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{step.location}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            step.completed
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-2">{step.date}</p>
                      <p className="text-gray-600 dark:text-gray-400 font-semibold">{step.time}</p>

                      <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Step {step.step} of {journeyData.journey.length}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 dark:bg-green-900 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-700">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed Steps</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {journeyData.journey.filter((j: any) => j.completed).length}
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900 rounded-xl shadow-lg p-6 border border-yellow-200 dark:border-yellow-700">
                <div className="text-4xl mb-2">⏳</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Steps</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {journeyData.journey.filter((j: any) => !j.completed).length}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-700">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((journeyData.journey.filter((j: any) => j.completed).length / journeyData.journey.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ready to Track</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a batch ID above to see the complete supply chain journey
            </p>
          </div>
        )}
      </main>
    </div>
  );
}