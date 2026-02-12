
import Link from 'next/link';

const categories = [
  { slug: 'forfetario', icon: '📋', title: 'Regime Forfetario', desc: 'Requisiti, limiti, coefficienti di redditività e novità 2026 sul regime agevolato.', query: 'Quali sono i requisiti per il regime forfetario 2026?' },
  { slug: 'iva', icon: '🧾', title: 'IVA e Adempimenti', desc: 'Aliquote, fatturazione elettronica, liquidazioni periodiche e dichiarazione IVA.', query: 'Come funziona la fatturazione elettronica e le liquidazioni IVA?' },
  { slug: 'dichiarazioni', icon: '📊', title: 'Dichiarazioni dei Redditi', desc: 'Modello 730, Redditi PF, SC e SP. Detrazioni, deduzioni e crediti d\'imposta.', query: 'Quali sono le principali detrazioni nel modello 730?' },
  { slug: 'scadenze', icon: '📅', title: 'Scadenze Fiscali', desc: 'Calendario completo degli adempimenti fiscali e contributivi 2026.', query: 'Quali sono le prossime scadenze fiscali 2026?' },
  { slug: 'societa', icon: '🏢', title: 'Società di Capitali', desc: 'IRES, bilancio, distribuzione utili, operazioni straordinarie e governance.', query: 'Come funziona la tassazione IRES per le società di capitali?' },
  { slug: 'agevolazioni', icon: '🎯', title: 'Agevolazioni e Bonus', desc: 'Crediti d\'imposta, incentivi per imprese, bonus edilizi e agevolazioni per startup.', query: 'Quali agevolazioni fiscali sono disponibili nel 2026?' },
  { slug: 'lavoro', icon: '👥', title: 'Lavoro e Previdenza', desc: 'Contributi INPS, CU, TFR, assunzioni agevolate e gestione del personale.', query: 'Come funzionano i contributi INPS per artigiani e commercianti?' },
  { slug: 'contabilita', icon: '📒', title: 'Contabilità', desc: 'Principi contabili, registrazioni, ammortamenti e gestione del bilancio.', query: 'Quali sono i principi contabili fondamentali per le PMI?' },
];

interface Article {
  title: string;
  link: string;
  date: string;
  source: string;
  category: string;
}

const RSS_FEEDS = [
  { url: 'https://www.eutekne.it/rss/feed.xml', source: 'eutekne.it' },
  { url: 'https://www.commercialistatelematico.com/feed', source: 'commercialistatelematico.com' },
  { url: 'https://www.ilsole24ore.com/rss/fisco.xml', source: 'ilsole24ore.com' },
];

function parseRss(xml: string, source: string): Article[] {
  const articles: Article[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title>(<!\[CDATA\[)?([\s\S]*?)(]]>)?<\/title>/i;
  const linkRegex = /<link>([\s\S]*?)<\/link>/i;
  const pubDateRegex = /<pubDate>([\s\S]*?)<\/pubDate>/i;

  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const titleMatch = item.match(titleRegex);
    const linkMatch = item.match(linkRegex);
    const pubDateMatch = item.match(pubDateRegex);

    const title = titleMatch ? (titleMatch[2] || '').trim().replace(/&amp;/g, '&').replace(/&quot;/g, '"') : '';
    const link = linkMatch ? (linkMatch[1] || '').trim() : '#';
    const date = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();

    if (title) articles.push({ title, link, date, source, category: 'fisco' });
  }
  return articles;
}

async function getArticles(): Promise<Article[]> {
  const allArticles: Article[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(feed.url, { next: { revalidate: 3600 } });
      if (!res.ok) continue;
      const xml = await res.text();
      allArticles.push(...parseRss(xml, feed.source));
    } catch {
      // Skip failed feeds
    }
  }

  allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return allArticles.slice(0, 20);
}

export default async function Approfondimenti() {
  const articles = await getArticles();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Approfondimenti Fiscali</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Guide, articoli e risorse aggiornate per orientarti nel mondo della fiscalità italiana.</p>
        </div>

        {/* Categories → link to chat with pre-filled question */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map(cat => (
            <Link key={cat.slug} href={`/chat?q=${encodeURIComponent(cat.query)}`} className="group bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all">
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{cat.title}</h2>
              <p className="text-sm text-slate-600 mb-4">{cat.desc}</p>
              <span className="text-xs font-medium text-blue-600">Chiedi a Taxami →</span>
            </Link>
          ))}
        </div>

        {/* RSS Articles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Ultimi Articoli</h2>
          <p className="text-sm text-slate-500 mb-6">Dalle principali testate fiscali italiane, aggiornati ogni ora.</p>

          {articles.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-slate-500">Nessun articolo disponibile al momento. Riprova più tardi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((article, i) => (
                <a key={i} href={article.link} target="_blank" rel="noopener noreferrer"
                  className="block bg-white rounded-lg p-4 border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-xs text-slate-400 whitespace-nowrap min-w-[90px]">{formatDate(article.date)}</span>
                    <h3 className="text-sm font-medium text-slate-900 flex-1 hover:text-blue-700 transition-colors">{article.title}</h3>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap font-medium">{article.source}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
