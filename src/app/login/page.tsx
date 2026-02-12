'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    if (isLogin) {
      const res = await signIn('credentials', { email, password, redirect: false });
      if (res?.error) {
        setError('Email o password non corretti');
      } else {
        router.push('/dashboard');
      }
    } else {
      const name = form.get('name') as string;
      const partitaIva = form.get('partitaIva') as string;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, partitaIva }),
      });

      if (res.ok) {
        await signIn('credentials', { email, password, redirect: false });
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Errore durante la registrazione');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{isLogin ? 'Accedi a Taxami' : 'Crea il tuo account'}</h1>
          <p className="text-sm text-slate-500 mt-2">{isLogin ? 'Inserisci le tue credenziali per continuare' : 'Registrati gratis e inizia subito'}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
            <button onClick={() => { setIsLogin(true); setError(''); }} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Accedi</button>
            <button onClick={() => { setIsLogin(false); setError(''); }} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Registrati</button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome completo</label>
                <input name="name" type="text" placeholder="Mario Rossi" required className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input name="email" type="email" placeholder="mario@esempio.it" required className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input name="password" type="password" placeholder="••••••••" required minLength={6} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Partita IVA (opzionale)</label>
                <input name="partitaIva" type="text" placeholder="IT12345678901" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50">
              {loading ? 'Caricamento...' : isLogin ? 'Accedi' : 'Crea account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          {isLogin ? 'Non hai un account? ' : 'Hai già un account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-blue-600 hover:text-blue-700">{isLogin ? 'Registrati gratis' : 'Accedi'}</button>
        </p>
        <p className="text-center text-xs text-slate-400 mt-4">
          Continuando accetti i <Link href="#" className="underline">Termini di Servizio</Link> e la <Link href="#" className="underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
