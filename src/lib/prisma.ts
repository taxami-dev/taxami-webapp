import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Skip Prisma initialization if no DATABASE_URL (e.g., during build)
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    return null as unknown as PrismaClient;
  }
  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
