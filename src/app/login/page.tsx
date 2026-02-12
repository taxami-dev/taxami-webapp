'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isLogin ? 'Accedi a Taxami' : 'Crea il tuo account'}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {isLogin ? 'Inserisci le tue credenziali per continuare' : 'Registrati gratis e inizia subito'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {/* Tab switch */}
          <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Accedi
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                !isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Registrati
            </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome completo</label>
                <input type="text" placeholder="Mario Rossi" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" placeholder="mario@esempio.it" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Partita IVA (opzionale)</label>
                <input type="text" placeholder="IT12345678901" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            )}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300" /> Ricordami
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">Password dimenticata?</a>
              </div>
            )}
            <button type="submit" className="w-full py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors">
              {isLogin ? 'Accedi' : 'Crea account'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-slate-400">oppure continua con</span></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <span>🔵</span> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <span>📧</span> SPID
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          {isLogin ? 'Non hai un account? ' : 'Hai già un account? '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:text-blue-700">
            {isLogin ? 'Registrati gratis' : 'Accedi'}
          </button>
        </p>

        <p className="text-center text-xs text-slate-400 mt-4">
          Continuando accetti i <Link href="#" className="underline">Termini di Servizio</Link> e la <Link href="#" className="underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
