import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'Token e password obbligatori' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La password deve avere almeno 6 caratteri' }, { status: 400 });
    }

    const resetRecord = await prisma.passwordReset.findFirst({
      where: { token, expires: { gt: new Date() } },
    });

    if (!resetRecord) {
      return NextResponse.json({ error: 'Token non valido o scaduto' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword },
    });

    // Delete all reset tokens for this email
    await prisma.passwordReset.deleteMany({ where: { email: resetRecord.email } });

    return NextResponse.json({ message: 'Password aggiornata con successo' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
