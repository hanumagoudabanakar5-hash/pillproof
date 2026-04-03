'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">💊 PillProof</h1>
          <div className="flex gap-6">
            <Link href="/register" className="hover:text-yellow-400">Register</Link>
            <Link href="/verify" className="hover:text-yellow-400">Verify</Link>
            <Link href="/detect" className="hover:text-yellow-400">Detect</Link>
            <Link href="/qr-scanner" className="hover:text-yellow-400">QR Scanner</Link>
            <Link href="/dashboard" className="hover:text-yellow-400">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-6">Welcome to PillProof</h2>
        <p className="text-xl text-gray-600 mb-12">
          Blockchain-based medicine supply chain verification system to prevent counterfeit drugs
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded-lg">
            📝 Register Batch
          </Link>
          <Link href="/verify" className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-4 rounded-lg">
            ✅ Verify Batch
          </Link>
          <Link href="/detect" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 px-4 rounded-lg">
            🔍 Detect Counterfeit
          </Link>
          <Link href="/qr-scanner" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-4 rounded-lg">
            📱 QR Scanner
          </Link>
        </div>

        <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-lg">
          📊 Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
