import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '€0',
    period: '/mese',
    desc: 'Perfetto per iniziare a esplorare Taxami.',
    cta: 'Inizia Gratis',
    featured: false,
    features: [
      '7 domande al mese',
      'Approfondimenti base',
      'Upload fino a 5 documenti',
      'Calendario scadenze',
      'Supporto email',
    ],
    missing: [
      'Domande illimitate',
      'Analisi documenti AI',
      'Risposte prioritarie',
      'Supporto dedicato',
    ],
  },
  {
    name: 'Premium',
    price: '€9,99',
    period: '/mese',
    desc: 'Per chi vuole il massimo dal consulente AI.',
    cta: 'Passa a Premium',
    featured: true,
    features: [
      'Domande illimitate',
      'Tutti gli approfondimenti',
      'Upload documenti illimitato',
      'Calendario scadenze + notifiche',
      'Analisi documenti con AI',
      'Risposte prioritarie',
      'Supporto dedicato via chat',
      'Esportazione report',
    ],
    missing: [],
  },
];

export default function Pricing() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Scegli il tuo piano</h1>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">Inizia gratis, passa a Premium quando vuoi. Nessun vincolo, disdici in qualsiasi momento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map(plan => (
          <div key={plan.name} className={`rounded-2xl p-8 ${
            plan.featured
              ? 'bg-blue-700 text-white ring-4 ring-blue-300 relative'
              : 'bg-white border border-gray-200'
          }`}>
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                ⭐ POPOLARE
              </span>
            )}
            <h2 className={`text-xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h2>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              <span className={`text-sm ${plan.featured ? 'text-blue-200' : 'text-gray-400'}`}>{plan.period}</span>
            </div>
            <p className={`mt-2 text-sm ${plan.featured ? 'text-blue-100' : 'text-gray-500'}`}>{plan.desc}</p>

            <Link href="/login" className={`block text-center mt-6 py-3 rounded-lg font-semibold transition-colors ${
              plan.featured
                ? 'bg-white text-blue-700 hover:bg-blue-50'
                : 'bg-blue-700 text-white hover:bg-blue-800'
            }`}>
              {plan.cta}
            </Link>

            <ul className="mt-6 space-y-3">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
              {plan.missing.map(f => (
                <li key={f} className={`flex items-center gap-2 text-sm ${plan.featured ? 'text-blue-300' : 'text-gray-300'}`}>
                  <span>✗</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-20 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Domande Frequenti</h2>
        {[
          { q: 'Posso disdire quando voglio?', a: 'Sì, puoi disdire il piano Premium in qualsiasi momento. Il servizio resterà attivo fino alla fine del periodo pagato.' },
          { q: 'Cosa succede dopo le 7 domande gratuite?', a: 'Potrai continuare a usare gli approfondimenti e il calendario scadenze, ma per nuove domande dovrai attendere il mese successivo o passare a Premium.' },
          { q: 'Taxami sostituisce il commercialista?', a: 'No, Taxami è uno strumento informativo che ti aiuta a capire meglio il fisco. Per pratiche ufficiali consigliamo sempre di rivolgerti a un professionista abilitato.' },
          { q: 'I miei dati sono al sicuro?', a: 'Assolutamente sì. Utilizziamo crittografia end-to-end e non condividiamo i tuoi dati con terzi. Leggi la nostra Privacy Policy per maggiori dettagli.' },
        ].map(faq => (
          <div key={faq.q} className="border-b border-gray-200 py-4">
            <h3 className="font-semibold text-gray-900">{faq.q}</h3>
            <p className="text-gray-500 text-sm mt-2">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
