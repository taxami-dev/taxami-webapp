import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email obbligatoria' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json({ message: 'Se l\'email esiste, riceverai un link per il reset.' });
    }

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.passwordReset.create({
      data: { email, token, expires },
    });

    // TODO: Send email with reset link
    // For now, log the token (in production, use a mail service)
    console.log(`Password reset token for ${email}: ${token}`);

    return NextResponse.json({ message: 'Se l\'email esiste, riceverai un link per il reset.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
