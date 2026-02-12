'use client';
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Suspense } from 'react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

const allSuggestions = [
  { icon: '📋', text: 'Quali sono i requisiti per il regime forfetario 2026?' },
  { icon: '📅', text: 'Quando scade la dichiarazione IVA?' },
  { icon: '💰', text: 'Come funziona la rottamazione quinquies?' },
  { icon: '🏠', text: 'Posso detrarre le spese di ristrutturazione?' },
  { icon: '🧾', text: 'Come funziona la fatturazione elettronica?' },
  { icon: '🏢', text: 'Quali sono gli adempimenti per aprire una SRL?' },
  { icon: '👥', text: 'Come funzionano i contributi INPS per gli artigiani?' },
  { icon: '🎯', text: 'Quali bonus edilizi sono ancora attivi nel 2026?' },
  { icon: '📊', text: 'Come si calcola l\'IRPEF con il regime ordinario?' },
  { icon: '💼', text: 'Quali sono i vantaggi del regime OSS per l\'e-commerce?' },
  { icon: '📒', text: 'Quando conviene passare dal forfetario all\'ordinario?' },
  { icon: '⚖️', text: 'Come funziona la cessione del credito d\'imposta?' },
];

function getRandomSuggestions(count: number) {
  const shuffled = [...allSuggestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function timeNow() {
  return new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

function ChatInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Ciao! 👋 Sono **Taxami**, il tuo consulente fiscale AI dello **Studio Di Sabato e Partners**.\n\nCome posso aiutarti oggi?', time: timeNow() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [suggestions] = useState(() => getRandomSuggestions(4));
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoSentRef = useRef(false);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (session) {
      fetch('/api/user/profile').then(r => r.json()).then(data => {
        if (data.piano === 'free') setRemaining(Math.max(0, 7 - (data.questionsToday || 0)));
      }).catch(() => {});
    }
  }, [session]);

  // Auto-send question from URL param ?q=
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !autoSentRef.current && status === 'authenticated') {
      autoSentRef.current = true;
      // Small delay to let the component mount
      setTimeout(() => sendMessage(q), 500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, status]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    if (status !== 'authenticated') {
      setMessages(prev => [...prev,
        { role: 'user', text, time: timeNow() },
        { role: 'assistant', text: '🔒 Per fare domande devi prima **accedere** o **registrarti**.\n\nClicca su "Accedi" in alto a destra!', time: timeNow() },
      ]);
      setInput('');
      return;
    }

    setMessages(prev => [...prev, { role: 'user', text, time: timeNow() }]);
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
        setMessages(prev => [...prev, { role: 'assistant', text: `⏰ ${data.error}\n\n💎 [Passa a Premium](/pricing) per domande illimitate!`, time: timeNow() }]);
        setRemaining(0);
      } else if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.answer, time: timeNow() }]);
        if (remaining !== null) setRemaining(Math.max(0, remaining - 1));
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: '❌ Si è verificato un errore. Riprova tra qualche istante.', time: timeNow() }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: '❌ Errore di connessione. Verifica la tua connessione internet.', time: timeNow() }]);
    }

    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div>
            <h1 className="font-semibold text-slate-900">Taxami AI</h1>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <div className="text-sm text-slate-500 flex items-center gap-2">
          {session ? (
            remaining !== null && (
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${remaining > 3 ? 'bg-blue-50 text-blue-700' : remaining > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                {remaining > 0 ? `${remaining} domande rimaste` : 'Limite raggiunto'}
              </span>
            )
          ) : (
            <button onClick={() => router.push('/login')} className="px-4 py-1.5 bg-blue-700 text-white text-xs rounded-full font-medium hover:bg-blue-800 transition-colors">
              Accedi per chattare
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0 shadow-sm">
                <span className="text-white font-bold text-xs">T</span>
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
              msg.role === 'user'
                ? 'bg-blue-700 text-white rounded-br-sm'
                : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm'
            }`}>
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              ) : (
                <div className="prose prose-sm prose-slate max-w-none [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_strong]:text-slate-900 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-semibold [&_h1]:mt-3 [&_h2]:mt-2 [&_h3]:mt-2 [&_a]:text-blue-600">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}
              <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                </div>
                <span className="text-sm text-slate-400 ml-1">Analizzo la normativa...</span>
              </div>
            </div>
          </div>
        )}
        {messages.length === 1 && !loading && (
          <div className="mt-6">
            <p className="text-xs text-slate-400 text-center mb-3 font-medium uppercase tracking-wide">Domande frequenti</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s.text)}
                  className="text-left text-sm bg-white border border-slate-200 rounded-xl p-3.5 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm transition-all text-slate-600 flex items-start gap-2.5 group">
                  <span className="text-lg">{s.icon}</span>
                  <span className="group-hover:text-slate-900 transition-colors">{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Scrivi la tua domanda fiscale..." disabled={loading}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 bg-slate-50 focus:bg-white transition-colors" />
          <button type="submit" disabled={loading || !input.trim()}
            className="px-5 py-3 bg-blue-700 text-white rounded-xl font-medium text-sm hover:bg-blue-800 transition-all disabled:opacity-40 disabled:hover:bg-blue-700 shadow-sm hover:shadow-md">
            Invia
          </button>
        </form>
        <p className="text-[11px] text-slate-400 mt-2 text-center">Le risposte AI hanno carattere informativo e non sostituiscono la consulenza professionale.</p>
      </div>
    </div>
  );
}

export default function Chat() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><p className="text-slate-400">Caricamento chat...</p></div>}>
      <ChatInner />
    </Suspense>
  );
}
