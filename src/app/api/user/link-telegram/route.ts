import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// File dei premium del bot Telegram
const PREMIUM_USERS_FILE = '/root/.openclaw/workspace/taxami_premium_users.json';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });

  const userId = (session.user as Record<string, unknown>).id as string;
  const { telegramId } = await req.json();

  if (!telegramId?.trim()) {
    return NextResponse.json({ error: 'Telegram ID obbligatorio' }, { status: 400 });
  }

  const cleanId = telegramId.trim();

  // Check if this telegramId is already linked to another account
  const existing = await prisma.user.findUnique({ where: { telegramId: cleanId } });
  if (existing && existing.id !== userId) {
    return NextResponse.json({ error: 'Questo Telegram ID è già collegato a un altro account' }, { status: 409 });
  }

  // Check if user is premium on the Telegram bot
  let isPremium = false;
  try {
    const fs = await import('fs');
    if (fs.existsSync(PREMIUM_USERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PREMIUM_USERS_FILE, 'utf8'));
      isPremium = Array.isArray(data)
        ? data.includes(Number(cleanId)) || data.includes(cleanId)
        : !!(data[cleanId]?.active || data[Number(cleanId)]?.active);
    }
  } catch {
    // If we can't read the file (e.g., on Vercel), just link without premium check
    console.log('Could not check Telegram premium status (expected on Vercel)');
  }

  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: {
      telegramId: cleanId,
      ...(isPremium ? { piano: 'premium' } : {}),
    },
  });

  return NextResponse.json({
    linked: true,
    premium: isPremium,
    message: isPremium
      ? '✅ Account collegato! Sei Premium su Telegram, le funzionalità Premium sono ora attive anche sul sito!'
      : '✅ Account Telegram collegato. Per sbloccare le funzionalità Premium, attiva l\'abbonamento sul bot @Taxami_bot.',
  });
}
