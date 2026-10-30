// Lógica pura: comprobable sin base de datos ni Next.js.
import { createHash } from 'node:crypto';

export const SESSION_AGE_SECONDS = 60 * 60 * 24; // 24 horas
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export function hashSessionToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function validSessionToken(token) {
  return typeof token === 'string' && /^[a-f\d]{64}$/.test(token);
}

export function isStrongAdminPassword(password) {
  return typeof password === 'string' && password.length >= 14 && password.length <= 128 && Buffer.byteLength(password, 'utf8') <= 72 && password.trim() === password;
}

export function normalizedAdminUsername(username) {
  return typeof username === 'string' ? username.trim().toLowerCase() : '';
}

export function validAdminUsername(username) {
  return typeof username === 'string' && /^[a-z0-9_]{3,40}$/.test(username);
}

function parseOrigin(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    const result = new URL(value);
    if (!['https:', 'http:'].includes(result.protocol)) return null;
    if (result.pathname !== '/' || result.search || result.hash || result.username || result.password) return null;
    return result.origin;
  } catch { return null; }
}

// No confiamos en comodines, cabeceras Forwarded ni subdominios arbitrarios.
// Para Cloudflare Tunnel configurar la URL exacta en APP_ALLOWED_ORIGINS.
export function isAllowedRequestOrigin(origin, requestUrl, allowedOrigins = '') {
  const provided = parseOrigin(origin);
  if (!provided) return false;
  const allowed = [new URL(requestUrl).origin, ...allowedOrigins.split(',').map(v => v.trim())]
    .map(parseOrigin).filter(Boolean);
  return allowed.includes(provided);
}
