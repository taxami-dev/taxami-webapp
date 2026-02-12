'use client';
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const suggestions = [
  'Quali sono i requisiti per il regime forfetario 2026?',
  'Quando scade la dichiarazione IVA?',
  'Come funziona la rottamazione quinquies?',
  'Posso detrarre le spese di ristrutturazione?',
];

export default function Chat() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Ciao! Sono Taxami, il tuo consulente fiscale AI. Come posso aiutarti oggi? 🧾' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (session) {
      fetch('/api/user/profile').then(r => r.json()).then(data => {
        if (data.piano === 'free') setRemaining(Math.max(0, 7 - (data.questionsToday || 0)));
      }).catch(() => {});
    }
  }, [session]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    if (status !== 'authenticated') {
      setMessages(prev => [...prev, { role: 'user', text }, { role: 'assistant', text: 'Per fare domande devi prima accedere o registrarti. Clicca su "Accedi" in alto a destra!' }]);
      setInput('');
      return;
    }

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/user/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setMessages(prev => [...prev, { role: 'assistant', text: `⏰ ${data.error}\n\n💎 Passa a Premium per domande illimitate!` }]);
        setRemaining(0);
      } else if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
        if (remaining !== null) setRemaining(Math.max(0, remaining - 1));
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: '❌ Si è verificato un errore. Riprova tra qualche istante.' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: '❌ Errore di connessione. Verifica la tua connessione internet.' }]);
    }

    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto">
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">T</span>
          </div>
          <div>
            <h1 className="font-semibold text-slate-900">Taxami AI</h1>
            <p className="text-xs text-green-600">● Online</p>
          </div>
        </div>
        <div className="text-sm text-slate-500">
          {session ? (
            remaining !== null && <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">{remaining} domande rimaste</span>
          ) : (
            <button onClick={() => router.push('/login')} className="px-3 py-1 bg-blue-700 text-white text-xs rounded-full">Accedi per chattare</button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-700 text-white rounded-br-md' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-slate-400">Sto analizzando la normativa... ⏳</div>
          </div>
        )}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)} className="text-left text-sm bg-white border border-slate-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50 transition-all text-slate-700">{s}</button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Scrivi la tua domanda fiscale..." disabled={loading}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
          <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium text-sm hover:bg-blue-800 transition-colors disabled:opacity-50">Invia</button>
        </form>
        <p className="text-xs text-slate-400 mt-2 text-center">Le risposte AI hanno carattere informativo e non sostituiscono la consulenza professionale.</p>
      </div>
    </div>
  );
}
