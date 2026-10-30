export function slugify(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
}
export function money(cents: number | null | undefined, currencyCode?: string | null) {
  if (cents == null) return 'Precio a consultar';
  if (!currencyCode || !['ARS','VES','USD','EUR'].includes(currencyCode)) return 'Moneda por configurar';
  return new Intl.NumberFormat('es', { style: 'currency', currency: currencyCode, maximumFractionDigits: 2 }).format(cents / 100);
}
export function safePublicUrl(value: string | null | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : undefined;
  } catch { return undefined; }
}
