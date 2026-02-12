
import { NextResponse } from 'next/server';

const RSS_FEEDS = [
  'https://www.eutekne.it/rss/feed.xml',
  'https://www.commercialistatelematico.com/feed',
  'https://www.ilsole24ore.com/rss/fisco.xml',
];

const CATEGORY_KEYWORDS: { [key: string]: string[] } = {
  forfetario: ['forfettario', 'forfetario', 'regime forfettario'],
  IVA: ['IVA', 'imposta sul valore aggiunto'],
  dichiarazioni: ['dichiarazione dei redditi', 'modello unico', '730', 'dichiarazioni'],
  scadenze: ['scadenze', 'adempimenti fiscali', 'termini'],
  società: ['società', 'SRL', 'SPA', 'societario'],
  agevolazioni: ['agevolazioni', 'bonus', 'credito d\'imposta', 'incentivi'],
  lavoro: ['lavoro', 'dipendenti', 'autonomo', 'collaborazione'],
  contabilità: ['contabilità', 'bilancio', 'registrazioni'],
};

function inferCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  for (const category in CATEGORY_KEYWORDS) {
    for (const keyword of CATEGORY_KEYWORDS[category]) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }
  return 'altro';
}

function parseRss(xml: string, source: string) {
  const articles = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title>(<\!\[CDATA\[)?([\s\S]*?)(]]>)?<\/title>/i;
  const linkRegex = /<link>([\s\S]*?)<\/link>/i;
  const pubDateRegex = /<pubDate>([\s\S]*?)<\/pubDate>/i;
  const descriptionRegex = /<description>(<\!\[CDATA\[)?([\s\S]*?)(]]>)?<\/description>/i;

  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const titleMatch = item.match(titleRegex);
    const linkMatch = item.match(linkRegex);
    const pubDateMatch = item.match(pubDateRegex);
    const descriptionMatch = item.match(descriptionRegex);

    const title = titleMatch ? (titleMatch[2] || '').trim().replace(/&amp;/g, '&') : 'No Title';
    const link = linkMatch ? (linkMatch[1] || '').trim() : '#';
    const date = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();
    const description = descriptionMatch ? (descriptionMatch[2] || '').trim().replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&') : '';

    const category = inferCategory(title, description);

    articles.push({ title, link, date, source, category });
  }

  // Handle Atom feeds as well
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  const atomTitleRegex = /<title type="html">([\s\S]*?)<\/title>/i;
  const atomLinkRegex = /<link href="([\s\S]*?)"\/>/i;
  const atomUpdatedRegex = /<updated>([\s\S]*?)<\/updated>/i;
  const atomSummaryRegex = /<summary type="html">([\s\S]*?)<\/summary>/i;


  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    const titleMatch = entry.match(atomTitleRegex);
    const linkMatch = entry.match(atomLinkRegex);
    const updatedMatch = entry.match(atomUpdatedRegex);
    const summaryMatch = entry.match(atomSummaryRegex);

    const title = titleMatch ? (titleMatch[1] || '').trim().replace(/&amp;/g, '&') : 'No Title';
    const link = linkMatch ? (linkMatch[1] || '').trim() : '#';
    const date = updatedMatch ? new Date(updatedMatch[1]).toISOString() : new Date().toISOString();
    const description = summaryMatch ? (summaryMatch[1] || '').trim().replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&') : '';

    const category = inferCategory(title, description);

    articles.push({ title, link, date, source, category });
  }

  return articles;
}

export async function GET() {
  let allArticles: any[] = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const response = await fetch(feedUrl, { next: { revalidate: 3600 } });
      if (!response.ok) {
        console.warn(`Failed to fetch RSS feed from ${feedUrl}: ${response.statusText}`);
        continue;
      }
      const xml = await response.text();
      const source = new URL(feedUrl).hostname.replace('www.', '');
      allArticles = allArticles.concat(parseRss(xml, source));
    } catch (error) {
      console.error(`Error fetching or parsing feed ${feedUrl}:`, error);
    }
  }

  allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestArticles = allArticles.slice(0, 30);

  return NextResponse.json(latestArticles);
}
