import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

export const prisma = new PrismaClient({
  log: env.isProd ? (['error'] as const) : (['warn', 'error'] as const),
});
