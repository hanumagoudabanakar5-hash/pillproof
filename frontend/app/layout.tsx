import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'PillProof — Medicine Supply Chain Verification',
  description:
    'Blockchain-based medicine supply chain verification system. Ensure the authenticity of every batch.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50">
        {/* Top Navigation */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
                <span className="text-2xl">💊</span>
                <span>PillProof</span>
              </Link>

              {/* Nav Links */}
              <div className="hidden md:flex items-center gap-1">
                <NavLink href="/" label="Home" />
                <NavLink href="/register" label="Register" />
                <NavLink href="/verify" label="Verify" />
                <NavLink href="/detect" label="Detect" />
                <NavLink href="/dashboard" label="Dashboard" />
                <NavLink href="/qr" label="QR Code" />
              </div>

              {/* Mobile hamburger placeholder */}
              <div className="md:hidden flex gap-2 text-sm font-medium">
                <Link href="/register" className="text-blue-600 hover:text-blue-800">Register</Link>
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

        {/* Footer */}
        <footer className="mt-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
            <p>
              <span className="font-semibold text-blue-700">PillProof</span> — Blockchain-Based Medicine
              Supply Chain Verification &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
    >
      {label}
    </Link>
  );
}
