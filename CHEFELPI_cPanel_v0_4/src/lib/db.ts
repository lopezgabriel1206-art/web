import { PrismaClient } from '@prisma/client';
const globalDb = globalThis as unknown as { chefelpiDb?: PrismaClient };
export const db = globalDb.chefelpiDb ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalDb.chefelpiDb = db;
export const databaseReady = () => Boolean(process.env.DATABASE_URL);
