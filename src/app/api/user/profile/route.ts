import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });

  const userId = (session.user as Record<string, unknown>).id as string;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, piano: true, partitaIva: true, createdAt: true,
      _count: { select: { documents: true, questions: true } }
    },
  });

  if (!user) return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const questionsToday = await prisma.question.count({
    where: { userId, createdAt: { gte: today } },
  });

  return NextResponse.json({ ...user, questionsToday });
}
