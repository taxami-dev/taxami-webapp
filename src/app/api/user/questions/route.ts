import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const SYSTEM_PROMPT = `Sei Taxami, un assistente fiscale italiano professionale dello Studio Di Sabato e Partners.
REGOLE: Rispondi DIRETTAMENTE. Sii preciso con riferimenti normativi.
Se l'utente menziona "regime forfetario": NO deduzione costi analitici, NO detrazione IVA, imposta sostitutiva 15% (o 5% startup).
La CU per compensi a forfetari: il committente NON opera ritenuta d'acconto.
NON mescolare MAI regole del regime ordinario con il forfetario.`;

const FREE_DAILY_LIMIT = 7;

async function callAI(prompt: string, isPremium: boolean): Promise<string> {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ];

  if (isPremium && process.env.OPENAI_API_KEY) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: 'gpt-4o', messages, max_tokens: 1500, temperature: 0.3 }),
    });
    const data = await res.json();
    if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
  }

  if (process.env.GEMINI_API_KEY) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GEMINI_API_KEY}` },
      body: JSON.stringify({ model: 'gemini-2.5-flash', messages, max_tokens: 1500, temperature: 0.3 }),
    });
    const data = await res.json();
    if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
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
  const piano = ((session.user as Record<string, unknown>).piano as string) || 'free';
  const { text } = await req.json();

  if (!text?.trim()) return NextResponse.json({ error: 'Domanda vuota' }, { status: 400 });

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

  const answer = await callAI(text, piano === 'premium');
  const question = await prisma.question.create({
    data: { text, answer, userId },
  });

  return NextResponse.json(question, { status: 201 });
}
