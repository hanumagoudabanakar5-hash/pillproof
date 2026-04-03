'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const API = 'http://localhost:8000';

interface Batch {
  batchId: string;
  medicineName: string;
  manufacturer: string;
  quantity: number;
  expiryDate: string;
  status: string;
  verified: boolean;
  createdAt: string;
}

export default function HomePage() {
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [healthRes, batchesRes] = await Promise.all([
          fetch(`${API}/api/health`),
          fetch(`${API}/api/batches`),
        ]);
        const health = await healthRes.json();
        setApiOk(health.success === true);

        if (batchesRes.ok) {
          const data = await batchesRes.json();
          const batches: Batch[] = data.batches || [];
          setStats({
            total: batches.length,
            verified: batches.filter((b) => b.verified).length,
            pending: batches.filter((b) => !b.verified).length,
          });
        }
      } catch {
        setApiOk(false);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const features = [
    {
      href: '/register',
      icon: '📋',
      title: 'Register Batch',
      description: 'Register a new medicine batch with full details and auto-generated blockchain hash.',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      badge: 'New',
    },
    {
      href: '/verify',
      icon: '✅',
      title: 'Verify Batch',
      description: 'Verify an existing batch to mark it as authentic and update the supply chain record.',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      badge: '',
    },
    {
      href: '/detect',
      icon: '🔍',
      title: 'Detect Counterfeit',
      description: 'Analyse a batch for counterfeit risk using expiry, quantity, and verification data.',
      color: 'bg-red-50 border-red-200 hover:bg-red-100',
      badge: 'AI',
    },
    {
      href: '/dashboard',
      icon: '📊',
      title: 'Track Journey',
      description: "View a batch's complete supply chain journey — from manufacturing to retail.",
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      badge: '',
    },
    {
      href: '/qr',
      icon: '📱',
      title: 'QR Code Generator',
      description: 'Generate a scannable QR code for any registered batch for quick field verification.',
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      badge: '',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12 space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mb-2">
          <span>🔗</span> Blockchain-Powered Verification
        </div>
        <h1 className="text-5xl font-extrabold text-slate-800 leading-tight">
          <span className="text-blue-700">PillProof</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          End-to-end medicine supply chain verification. Ensure every batch is authentic, traceable,
          and tamper-proof.
        </p>

        {/* API status indicator */}
        <div className="flex items-center justify-center gap-2 text-sm mt-2">
          {loading ? (
            <span className="text-slate-400">Checking backend…</span>
          ) : apiOk ? (
            <span className="flex items-center gap-1 text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse" />
              Backend online
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-500">
              <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
              Backend offline — start the Express server on port 8000
            </span>
          )}
        </div>

        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md transition-colors"
          >
            Register a Batch
          </Link>
          <Link
            href="/dashboard"
            className="bg-white text-blue-600 border border-blue-300 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Batches', value: stats.total, icon: '📦', color: 'text-blue-600' },
          { label: 'Verified', value: stats.verified, icon: '✅', color: 'text-green-600' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: 'text-amber-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow p-6 text-center border border-slate-100">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className={`text-4xl font-bold ${s.color}`}>{loading ? '…' : s.value}</div>
            <div className="text-slate-500 mt-1 text-sm">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Feature Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`card-hover block border rounded-xl p-6 transition-all ${f.color}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{f.icon}</span>
                {f.badge && (
                  <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    {f.badge}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mt-3">{f.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{f.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white rounded-2xl shadow p-8 border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">How It Works</h2>
        <ol className="space-y-4">
          {[
            { step: '1', title: 'Register', desc: 'Manufacturer registers a new medicine batch.' },
            { step: '2', title: 'Hash', desc: 'A unique blockchain hash is generated for the batch.' },
            { step: '3', title: 'Verify', desc: 'Regulatory authority verifies the batch details.' },
            { step: '4', title: 'Track', desc: 'The batch is tracked through the full supply chain.' },
            { step: '5', title: 'Confirm', desc: 'Retailer and patient can confirm authenticity via QR.' },
          ].map((item) => (
            <li key={item.step} className="flex items-start gap-4">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {item.step}
              </span>
              <div>
                <span className="font-semibold text-slate-800">{item.title}</span>
                <span className="text-slate-600 ml-2">{item.desc}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
