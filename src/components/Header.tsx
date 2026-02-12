'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/approfondimenti', label: 'Approfondimenti' },
    { href: '/simulatore', label: 'Simulatore' },
    { href: '/chat', label: 'Chat AI' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-blue-700">Taxami</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">
                {l.label}
              </Link>
            ))}
            <Link href="/login" className="ml-2 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">
              Accedi
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-slate-100 pt-2">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-600 hover:text-blue-700">
                {l.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setMenuOpen(false)} className="block mt-2 text-center px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg">
              Accedi
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
