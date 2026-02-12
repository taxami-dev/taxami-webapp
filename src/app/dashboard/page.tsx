'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Profile {
  name: string | null;
  piano: string;
  _count: { documents: number; questions: number };
}

interface Question {
  id: string;
  text: string;
  createdAt: string;
}

interface Doc {
  id: string;
  name: string;
  category: string;
  createdAt: string;
}

const scadenze = [
  { date: '16 Feb 2026', title: 'Versamento IVA mensile', status: 'urgente' },
  { date: '16 Mar 2026', title: 'Versamento IVA mensile', status: 'prossima' },
  { date: '31 Mar 2026', title: 'Comunicazione liquidazioni periodiche', status: 'prossima' },
  { date: '30 Apr 2026', title: 'Dichiarazione IVA annuale', status: 'futura' },
  { date: '30 Giu 2026', title: 'Saldo IRPEF + primo acconto', status: 'futura' },
];

const statusColor: Record<string, string> = {
  urgente: 'bg-red-100 text-red-700',
  prossima: 'bg-yellow-100 text-yellow-700',
  futura: 'bg-green-100 text-green-700',
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [documents, setDocuments] = useState<Doc[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/user/profile').then(r => r.json()).then(setProfile).catch(() => {});
      fetch('/api/user/questions').then(r => r.json()).then(d => Array.isArray(d) ? setQuestions(d) : null).catch(() => {});
      fetch('/api/user/documents').then(r => r.json()).then(d => Array.isArray(d) ? setDocuments(d) : null).catch(() => {});
    }
  }, [status]);

  if (status === 'loading' || !session) {
    return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Caricamento...</p></div>;
  }

  const todayQuestions = questions.filter(q => new Date(q.createdAt).toDateString() === new Date().toDateString()).length;
  const userName = profile?.name || session.user?.name || 'Utente';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Bentornato, {userName} 👋</p>
        </div>
        <Link href="/chat" className="bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-800 transition-colors inline-flex items-center gap-2">
          💬 Chiedi a Taxami
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Domande oggi', value: `${todayQuestions}/7`, icon: '💬', sub: `Piano ${profile?.piano || 'free'}` },
          { label: 'Documenti caricati', value: String(profile?._count?.documents || documents.length), icon: '📄', sub: `${documents.length} totali` },
          { label: 'Prossima scadenza', value: '16 Feb', icon: '📅', sub: 'IVA mensile' },
          { label: 'Piano attivo', value: profile?.piano === 'premium' ? 'Premium' : 'Free', icon: '⭐', sub: profile?.piano === 'premium' ? 'Piano attivo' : 'Passa a Premium' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{card.label}</span>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-400 mt-1">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">📅 Prossime Scadenze</h2>
            <span className="text-xs text-gray-400">{scadenze.length} scadenze</span>
          </div>
          <div className="divide-y divide-gray-50">
            {scadenze.map(s => (
              <div key={s.title} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.title}</p>
                  <p className="text-xs text-gray-400">{s.date}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[s.status]}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">📄 Documenti Recenti</h2>
            <Link href="/documenti" className="text-sm text-blue-700 hover:underline">Vedi tutti</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {documents.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-400">Nessun documento caricato</div>
            ) : documents.slice(0, 5).map(doc => (
              <div key={doc.id} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📄</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-400">{new Date(doc.createdAt).toLocaleDateString('it-IT')}</p>
                  </div>
                </div>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">{doc.category}</span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-100">
            <Link href="/documenti" className="text-blue-700 text-sm font-medium hover:underline">+ Carica nuovo documento</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
