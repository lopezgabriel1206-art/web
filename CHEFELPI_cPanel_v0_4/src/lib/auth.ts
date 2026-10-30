import 'server-only';
import { cookies } from 'next/headers';
import { randomBytes } from 'node:crypto';
import { db, databaseReady } from './db';
import { SESSION_AGE_SECONDS, hashSessionToken, validSessionToken, isAllowedRequestOrigin } from './auth-policy.mjs';

export const sessionCookie = 'chefelpi_session';

export async function getAdmin() {
  if (!databaseReady()) return null;
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!validSessionToken(token)) return null;
  try {
    const session = await db.adminSession.findUnique({
      where: {tokenHash: hashSessionToken(token)},
      include: {user: {select: {id:true, name:true, username:true}}},
    });
    if (!session || session.revokedAt || session.expiresAt <= new Date()) return null;
    return session.user;
  } catch {
    // Nunca asumimos una sesión válida si la BD no está disponible.
    return null;
  }
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex');
  await db.adminSession.create({
    data: {userId, tokenHash: hashSessionToken(token), expiresAt: new Date(Date.now() + SESSION_AGE_SECONDS * 1000)},
  });
  (await cookies()).set(sessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_AGE_SECONDS,
    path: '/',
  });
}

export async function deleteSession() {
  const jar = await cookies();
  const token = jar.get(sessionCookie)?.value;
  if (validSessionToken(token)) {
    await db.adminSession.updateMany({
      where: {tokenHash: hashSessionToken(token)},
      data: {revokedAt: new Date()},
    });
  }
  jar.delete(sessionCookie);
}

export function validateOrigin(request: Request) {
  const allowed = [process.env.NEXT_PUBLIC_SITE_URL, process.env.APP_ALLOWED_ORIGINS]
    .filter(Boolean).join(',');
  return isAllowedRequestOrigin(request.headers.get('origin'), request.url, allowed);
}
