import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-white">Taxami</span>
            </div>
            <p className="text-sm text-gray-400">Il tuo consulente fiscale AI. Risposte immediate su fisco, IVA, dichiarazioni e molto altro.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Servizi</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/approfondimenti" className="hover:text-white transition-colors">Approfondimenti</Link></li>
              <li><Link href="/chat" className="hover:text-white transition-colors">Chat AI</Link></li>
              <li><Link href="/documenti" className="hover:text-white transition-colors">Documenti</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Legale</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Termini di Servizio</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Contatti</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 info@taxami.it</li>
              <li>📱 Telegram: @TaxamiBot</li>
              <li>📍 Milano, Italia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Taxami. Tutti i diritti riservati.</p>
          <p className="mt-1">Taxami è uno strumento informativo e non sostituisce la consulenza di un professionista abilitato.</p>
        </div>
      </div>
    </footer>
  );
}
