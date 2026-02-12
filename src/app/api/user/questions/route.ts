import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const SYSTEM_PROMPT = `Sei Taxami, un assistente fiscale italiano professionale dello Studio Di Sabato e Partners.
Borgomanero (NO) — Tel. 0322.340513

REGOLE FONDAMENTALI:
1. Rispondi DIRETTAMENTE con precisione e riferimenti normativi.
2. Se l'utente menziona "regime forfetario": NO deduzione costi analitici, NO detrazione IVA, imposta sostitutiva 15% (o 5% startup per 5 anni).
3. La CU per compensi a forfetari: il committente NON opera ritenuta d'acconto.
4. NON mescolare MAI regole del regime ordinario con il forfetario.
5. USA SEMPRE le informazioni di contesto fornite dal web search per dare risposte aggiornate.
6. Se il contesto web fornisce informazioni recenti, USALE e citale.
7. Non dire MAI che qualcosa "non esiste" se il contesto web lo menziona.
8. Anno corrente: 2026.`;

const FREE_DAILY_LIMIT = 7;

async function searchWeb(query: string): Promise<string> {
  const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
  if (!BRAVE_API_KEY) return '';

  try {
    const searchQuery = `${query} normativa fiscale italiana 2025 2026`;
    const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchQuery)}&count=5&search_lang=it&country=IT`, {
      headers: { 'Accept': 'application/json', 'Accept-Encoding': 'gzip', 'X-Subscription-Token': BRAVE_API_KEY },
    });

    if (!res.ok) return '';

    const data = await res.json();
    const results = data.web?.results || [];
    
    if (results.length === 0) return '';

    const snippets = results.slice(0, 5).map((r: { title: string; description: string; url: string }, i: number) => 
      `[${i + 1}] ${r.title}\n${r.description}\nFonte: ${r.url}`
    ).join('\n\n');

    return `\n\n--- CONTESTO WEB AGGIORNATO ---\n${snippets}\n--- FINE CONTESTO ---`;
  } catch (error) {
    console.error('Web search error:', error);
    return '';
  }
}

async function callAI(prompt: string, isPremium: boolean, webContext: string): Promise<string> {
  const premiumInstructions = isPremium ? `\n\nQUESTO UTENTE È PREMIUM — RISPONDI IN MODO APPROFONDITO:
- Fornisci risposte dettagliate e complete con esempi pratici
- Cita articoli di legge specifici, commi, decreti
- Includi calcoli numerici se pertinenti
- Suggerisci strategie fiscali e ottimizzazioni
- Segnala scadenze rilevanti
- Se utile, menziona giurisprudenza o prassi dell'Agenzia delle Entrate` : '';
  const systemWithContext = SYSTEM_PROMPT + premiumInstructions + (webContext ? `\n\nUSA queste informazioni aggiornate per rispondere:\n${webContext}` : '');

  const messages = [
    { role: 'system', content: systemWithContext },
    { role: 'user', content: prompt },
  ];

  if (isPremium && process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: 'gpt-4o', messages, max_tokens: 2500, temperature: 0.3 }),
      });
      const data = await res.json();
      if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
    } catch (e) {
      console.error('OpenAI error:', e);
    }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GEMINI_API_KEY}` },
        body: JSON.stringify({ model: 'gemini-2.5-flash', messages, max_tokens: 1500, temperature: 0.3 }),
      });
      const data = await res.json();
      if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
    } catch (e) {
      console.error('Gemini error:', e);
    }
  }

  return 'Mi scuso, il servizio AI è temporaneamente non disponibile. Riprova tra qualche minuto.';
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });

  const userId = (session.user as Record<string, unknown>).id as string;
  const questions = await prisma.question.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json(questions);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });

  const userId = (session.user as Record<string, unknown>).id as string;
  const { text } = await req.json();

  if (!text?.trim()) return NextResponse.json({ error: 'Domanda vuota' }, { status: 400 });

  // Get user plan
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { piano: true } });
  const piano = user?.piano || 'free';

  if (piano === 'free') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await prisma.question.count({
      where: { userId, createdAt: { gte: today } },
    });
    if (count >= FREE_DAILY_LIMIT) {
      return NextResponse.json({
        error: `Hai raggiunto il limite di ${FREE_DAILY_LIMIT} domande gratuite oggi. Passa a Premium per domande illimitate!`,
        limitReached: true,
      }, { status: 429 });
    }
  }

  // Search web for current context
  const webContext = await searchWeb(text);

  const answer = await callAI(text, piano === 'premium', webContext);
  const question = await prisma.question.create({
    data: { text, answer, userId },
  });

  return NextResponse.json(question, { status: 201 });
}
