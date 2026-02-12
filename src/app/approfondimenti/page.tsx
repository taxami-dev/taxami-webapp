
import Link from 'next/link';

const categories = [
  { slug: 'forfetario', icon: '📋', title: 'Regime Forfetario', desc: 'Requisiti, limiti, coefficienti di redditività e novità 2026 sul regime agevolato.', articles: 12 },
  { slug: 'iva', icon: '🧾', title: 'IVA e Adempimenti', desc: 'Aliquote, fatturazione elettronica, liquidazioni periodiche e dichiarazione IVA.', articles: 18 },
  { slug: 'dichiarazioni', icon: '📊', title: 'Dichiarazioni dei Redditi', desc: 'Modello 730, Redditi PF, SC e SP. Detrazioni, deduzioni e crediti d\'imposta.', articles: 15 },
  { slug: 'scadenze', icon: '📅', title: 'Scadenze Fiscali', desc: 'Calendario completo degli adempimenti fiscali e contributivi 2026.', articles: 8 },
  { slug: 'societa', icon: '🏢', title: 'Società di Capitali', desc: 'IRES, bilancio, distribuzione utili, operazioni straordinarie e governance.', articles: 10 },
  { slug: 'agevolazioni', icon: '🎯', title: 'Agevolazioni e Bonus', desc: 'Crediti d\'imposta, incentivi per imprese, bonus edilizi e agevolazioni per startup.', articles: 14 },
  { slug: 'lavoro', icon: '👥', title: 'Lavoro e Previdenza', desc: 'Contributi INPS, CU, TFR, assunzioni agevolate e gestione del personale.', articles: 9 },
  { slug: 'contabilita', icon: '📒', title: 'Contabilità', desc: 'Principi contabili, registrazioni, ammortamenti e gestione del bilancio.', articles: 11 },
];

interface Article {
  title: string;
  link: string;
  date: string;
  source: string;
  category: string;
}

const fallbackArticles: Article[] = [
  { date: '2026-02-12T00:00:00.000Z', title: 'Rottamazione Quinquies: guida completa alla nuova definizione agevolata', category: 'agevolazioni', source: 'Internal', link: '#' },
  { date: '2026-02-11T00:00:00.000Z', title: 'CPB e visto di conformità: cosa cambia per i crediti pregressi', category: 'dichiarazioni', source: 'Internal', link: '#' },
  { date: '2026-02-10T00:00:00.000Z', title: 'Certificazione Unica 2026: tutte le novità da conoscere', category: 'lavoro', source: 'Internal', link: '#' },
  { date: '2026-02-09T00:00:00.000Z', title: 'Regime forfetario 2026: i nuovi limiti e le cause di esclusione', category: 'forfetario', source: 'Internal', link: '#' },
  { date: '2026-02-08T00:00:00.000Z', title: 'Contribuzione IVS artigiani e commercianti: aliquote 2026', category: 'lavoro', source: 'Internal', link: '#' },
];

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/articles`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error('Failed to fetch articles:', res.status, res.statusText);
      return fallbackArticles;
    }
    const data: Article[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return fallbackArticles;
  }
}

export default async function Approfondimenti() {
  const articles = await getArticles();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Approfondimenti Fiscali</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Guide, articoli e risorse aggiornate per orientarti nel mondo della fiscalità italiana.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map(cat => (
            <Link key={cat.slug} href={`/approfondimenti/${cat.slug}`} className="group bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all">
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{cat.title}</h2>
              <p className="text-sm text-slate-600 mb-4">{cat.desc}</p>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{cat.articles} articoli</span>
            </Link>
          ))}
        </div>

        {/* Recent articles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Ultimi Articoli</h2>
          <div className="space-y-4">
            {articles.map((article, i) => (
              <a key={i} href={article.link} target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-4 border border-slate-200 hover:border-blue-200 transition-colors flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-xs text-slate-500 whitespace-nowrap">{formatDate(article.date)}</span>
                <h3 className="text-sm font-medium text-slate-900 flex-1">{article.title} - <span className="text-blue-600">{article.source.replace('.it', '').replace('.com', '')}</span></h3>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap">{article.category}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
