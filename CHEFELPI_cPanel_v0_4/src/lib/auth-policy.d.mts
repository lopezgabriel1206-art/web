export const SESSION_AGE_SECONDS: number;
export const MAX_LOGIN_ATTEMPTS: number;
export const LOGIN_WINDOW_MS: number;
export function hashSessionToken(token: string): string;
export function validSessionToken(token: unknown): token is string;
export function isStrongAdminPassword(password: unknown): password is string;
export function normalizedAdminUsername(username: unknown): string;
export function validAdminUsername(username: unknown): boolean;
export function isAllowedRequestOrigin(origin: string | null, requestUrl: string, allowedOrigins?: string): boolean;
