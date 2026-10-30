import type { NextConfig } from 'next';

// Next.js exige habilitar explícitamente hostnames externos para el servidor dev.
// Usamos la MISMA lista exacta de orígenes admitidos en el login; no hay wildcard.
const allowedDevOrigins = (process.env.APP_ALLOWED_ORIGINS || '')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean)
  .flatMap(value => {
    try { return [new URL(value).hostname]; }
    catch { return []; }
  });

const nextConfig: NextConfig = {
  // Modo servidor Node para cPanel/Passenger: no exportación estática.
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins,
};
export default nextConfig;
