import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">
              <span>💊</span>
              <span>PillProof</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Blockchain-powered medicine supply chain verification on Algorand.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</Link></li>
              <li><Link href="/batch/register" className="hover:text-blue-600 dark:hover:text-blue-400">Register Batch</Link></li>
              <li><Link href="/batch/verify" className="hover:text-blue-600 dark:hover:text-blue-400">Verify Batch</Link></li>
              <li><Link href="/payment" className="hover:text-blue-600 dark:hover:text-blue-400">Make Payment</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Info
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About</Link></li>
              <li><Link href="/settings" className="hover:text-blue-600 dark:hover:text-blue-400">Settings</Link></li>
              <li><Link href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-700 text-center text-xs text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} PillProof — Built on Algorand Testnet
        </div>
      </div>
    </footer>
  );
}
