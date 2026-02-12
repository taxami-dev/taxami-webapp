'use client';
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const suggestions = [
  'Come funziona il regime forfetario?',
  'Quali sono le scadenze IVA?',
  'Posso detrarre le spese mediche?',
  'Differenza tra SRL e SRLS?',
];

const aiResponses: Record<string, string> = {
  default: "Grazie per la domanda! Sono Taxami, il tuo consulente fiscale AI. Al momento sono in modalità demo, ma nella versione completa potrò rispondere a tutte le tue domande su fisco, IVA, dichiarazioni e molto altro. 🤖",
  forfetario: "Il **Regime Forfetario** è un regime fiscale agevolato per partite IVA con ricavi fino a €85.000. Prevede un'imposta sostitutiva del 15% (ridotta al 5% per i primi 5 anni di attività). Non si applica IVA e non si deducono i costi analiticamente, ma si usa un coefficiente di redditività. Vuoi sapere di più sui requisiti di accesso?",
  iva: "Le **scadenze IVA** principali sono: liquidazione mensile entro il 16 del mese successivo, trimestrale entro il 16 del secondo mese successivo al trimestre. La dichiarazione IVA annuale va presentata entro il 30 aprile. Lo split payment si applica alle operazioni verso la PA.",
  detrarre: "Le **spese mediche** sono detraibili al 19% per la parte eccedente la franchigia di €129,11. Sono incluse: visite specialistiche, farmaci (con scontrino parlante), esami diagnostici, interventi chirurgici, protesi. Il pagamento deve essere tracciabile (carta/bonifico) tranne che per farmaci e dispositivi medici.",
  srl: "La **SRL** (Società a Responsabilità Limitata) richiede un capitale minimo di €10.000, mentre la **SRLS** (Semplificata) può essere costituita con solo €1. La SRLS ha costi di costituzione ridotti (niente notaio per l'atto standard), ma ha limitazioni: i soci devono essere persone fisiche e lo statuto è standard. Entrambe offrono responsabilità limitata al capitale conferito.",
};

function getResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('forfetario') || lower.includes('forfettario')) return aiResponses.forfetario;
  if (lower.includes('iva') || lower.includes('scadenz')) return aiResponses.iva;
  if (lower.includes('detrar') || lower.includes('medic')) return aiResponses.detrarre;
  if (lower.includes('srl')) return aiResponses.srl;
  return aiResponses.default;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Ciao! Sono **Taxami**, il tuo consulente fiscale AI 🤖\n\nPuoi chiedermi qualsiasi cosa su fisco, IVA, dichiarazioni dei redditi, regime forfetario e molto altro. Come posso aiutarti?' },
  ]);
  const [input, setInput] = useState('');

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text: text.trim() };
    const aiMsg: Message = { role: 'assistant', text: getResponse(text) };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col" style={{ height: 'calc(100vh - 130px)' }}>
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">T</span>
        </div>
        <div>
          <h1 className="font-bold text-gray-900">Taxami AI</h1>
          <p className="text-xs text-green-600">● Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-blue-700 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-800 rounded-bl-md'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map(s => (
            <button key={s} onClick={() => send(s)} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          placeholder="Scrivi la tua domanda fiscale..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button onClick={() => send(input)} className="bg-blue-700 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors">
          Invia
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-3">
        Piano Free: 7 domande/mese • <a href="/pricing" className="text-blue-600 hover:underline">Passa a Premium</a>
      </p>
    </div>
  );
}
