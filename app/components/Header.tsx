'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Register Batch', href: '/batch/register' },
    { name: 'Verify Batch', href: '/batch/verify' },
    { name: 'Track Journey', href: '/batch/journey' },
    { name: 'Raise Alert', href: '/alert' },
    { name: 'Supply Chain', href: '/supply-chain/transfer' },
    { name: 'Procurement', href: '/procurement' },
    { name: 'Payment', href: '/payment' },
    { name: 'Transactions', href: '/transactions' },
    { name: 'Admin', href: '/admin' },
    { name: 'Settings', href: '/settings' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            PillProof
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            ☰
          </button>

          <div className={`${isOpen ? 'block' : 'hidden'} md:flex gap-1 absolute md:relative top-16 md:top-0 left-0 right-0 md:left-auto md:right-auto bg-white dark:bg-slate-800 md:bg-transparent md:dark:bg-transparent flex-col md:flex-row p-4 md:p-0`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}