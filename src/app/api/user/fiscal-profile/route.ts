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
    select: { regimeFiscale: true, codiceAteco: true, settoreAttivita: true, annoApertura: true, partitaIva: true },
  });

  return NextResponse.json(user || {});
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });

  const userId = (session.user as Record<string, unknown>).id as string;
  const { regimeFiscale, codiceAteco, settoreAttivita, annoApertura, partitaIva } = await req.json();

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(regimeFiscale !== undefined && { regimeFiscale }),
      ...(codiceAteco !== undefined && { codiceAteco }),
      ...(settoreAttivita !== undefined && { settoreAttivita }),
      ...(annoApertura !== undefined && { annoApertura: annoApertura ? parseInt(annoApertura) : null }),
      ...(partitaIva !== undefined && { partitaIva }),
    },
    select: { regimeFiscale: true, codiceAteco: true, settoreAttivita: true, annoApertura: true, partitaIva: true },
  });

  return NextResponse.json(user);
}
