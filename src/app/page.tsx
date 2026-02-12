import Link from 'next/link';

const features = [
  { icon: '💬', title: 'Consulenza AI Istantanea', desc: 'Fai domande fiscali in linguaggio naturale e ricevi risposte precise in tempo reale.' },
  { icon: '📄', title: 'Gestione Documenti', desc: 'Carica e organizza fatture, CU, F24 e tutti i documenti fiscali in un unico posto.' },
  { icon: '📅', title: 'Scadenze Sempre Aggiornate', desc: 'Non perdere mai una scadenza fiscale con promemoria automatici e calendario integrato.' },
  { icon: '📚', title: 'Approfondimenti Normativi', desc: 'Articoli e guide aggiornate su regime forfetario, IVA, società e agevolazioni.' },
  { icon: '🔒', title: 'Dati Protetti', desc: 'I tuoi dati fiscali sono al sicuro con crittografia end-to-end e server in Italia.' },
  { icon: '💰', title: 'Risparmio Garantito', desc: 'Consulenza professionale a una frazione del costo di un commercialista tradizionale.' },
];

const steps = [
  { num: '1', title: 'Registrati gratis', desc: 'Crea il tuo account in 30 secondi. Nessuna carta di credito richiesta.' },
  { num: '2', title: 'Fai la tua domanda', desc: 'Scrivi in italiano qualsiasi quesito fiscale, normativo o contabile.' },
  { num: '3', title: 'Ricevi la risposta', desc: 'Il nostro AI analizza la normativa vigente e ti fornisce una risposta chiara e aggiornata.' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 bg-blue-600/50 rounded-full text-sm font-medium mb-6">
              🚀 Il futuro della consulenza fiscale
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Il tuo consulente fiscale AI,{' '}
              <span className="text-sky-300">sempre disponibile</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
              Risposte immediate su fisco, IVA, dichiarazioni e adempimenti normativi.
              Pensato per PMI, partite IVA e professionisti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/chat" className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-center">
                Prova gratis →
              </Link>
              <Link href="/pricing" className="px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-center">
                Vedi i piani
              </Link>
            </div>
            <p className="text-sm text-blue-200 mt-4">✓ 7 domande gratuite · ✓ Nessuna carta richiesta · ✓ Risposte in tempo reale</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tutto ciò che ti serve, in un&apos;unica piattaforma</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Taxami combina intelligenza artificiale e normativa fiscale aggiornata per darti risposte precise quando ne hai bisogno.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Come funziona</h2>
            <p className="text-lg text-slate-600">Tre semplici passaggi per la tua consulenza fiscale</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-blue-700 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{s.num}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Pronto a semplificare il fisco?</h2>
          <p className="text-lg text-slate-600 mb-8">Unisciti a centinaia di professionisti che usano Taxami ogni giorno.</p>
          <Link href="/chat" className="inline-block px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors">
            Inizia gratis →
          </Link>
        </div>
      </section>
    </div>
  );
}
