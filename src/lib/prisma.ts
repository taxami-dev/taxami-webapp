import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    // During build time, return a proxy that won't crash
    return new Proxy({} as PrismaClient, {
      get: () => {
        throw new Error('DATABASE_URL not configured');
      },
    });
  }
  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
