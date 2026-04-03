import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-5xl">💊</span>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">PillProof</h1>
        </div>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Blockchain-powered medicine supply chain verification and counterfeit detection on Algorand.
        </p>
      </div>

      {/* Mission */}
      <section className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">🎯 Mission</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          PillProof aims to eliminate counterfeit medicines from the supply chain by leveraging
          Algorand blockchain technology. Every batch is registered, tracked, and verified
          on-chain — ensuring patients always receive genuine medication.
        </p>
      </section>

      {/* Tech Stack */}
      <section className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">🛠️ Tech Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { name: "Next.js 16", icon: "▲", desc: "Frontend framework" },
            { name: "React 19", icon: "⚛️", desc: "UI library" },
            { name: "TypeScript", icon: "🔷", desc: "Type safety" },
            { name: "Tailwind CSS", icon: "🎨", desc: "Styling" },
            { name: "Algorand", icon: "Ⓐ", desc: "Blockchain" },
            { name: "FastAPI", icon: "🐍", desc: "Backend API" },
            { name: "SQLite", icon: "🗄️", desc: "Database" },
            { name: "QR Codes", icon: "📱", desc: "Batch tracking" },
          ].map((t) => (
            <div
              key={t.name}
              className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3 text-center"
            >
              <div className="text-2xl">{t.icon}</div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-1">{t.name}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">✨ Features</h2>
        <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          {[
            "Register medicine batches with QR codes",
            "Verify batch authenticity instantly",
            "Track full supply chain journey",
            "Raise counterfeit alerts to CDSCO",
            "Algorand ALGO payments with USD/INR conversion",
            "Procurement order management with escrow",
            "Admin analytics dashboard",
            "Dark mode and mobile responsive",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">📬 Contact</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Have questions or want to contribute? Check out the project on GitHub.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/hanumagoudabanakar5-hash/pillproof"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            GitHub Repository
          </a>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
