'use client';

import Header from './components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to PillProof
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Blockchain-based medicine supply chain verification system using Algorand
          </p>
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition shadow-lg hover:shadow-xl text-lg">
            Go to Dashboard →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <div className="text-5xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Verify Authenticity</h3>
            <p className="text-gray-600 dark:text-gray-400">Ensure every medicine batch is genuine and safe with blockchain verification.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Track Journey</h3>
            <p className="text-gray-600 dark:text-gray-400">Follow the complete supply chain from manufacturer to pharmacy.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Prevent Counterfeits</h3>
            <p className="text-gray-600 dark:text-gray-400">Advanced detection systems to prevent counterfeit medicines.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
