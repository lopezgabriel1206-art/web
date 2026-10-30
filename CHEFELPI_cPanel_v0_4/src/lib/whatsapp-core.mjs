// Módulo JavaScript puro, probado con node --test (sin dependencias).
export function whatsappLink(rawPhone, message) {
  const phone = String(rawPhone ?? '').replace(/\D/g, '');
  if (!/^\d{8,15}$/.test(phone)) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
export function dishMessage(name, quantity, zone, date, notes = '') {
  return [
    `¡Hola, Chefelpi! Quisiera consultar por un pedido de ${name}.`,
    `Cantidad: ${quantity}.`,
    `Zona de entrega: ${zone}.`,
    `Fecha deseada: ${date}.`,
    notes.trim() ? `Observaciones: ${notes.trim()}.` : '',
    '¿Me confirmás disponibilidad y precio final?',
  ].filter(Boolean).join('\n');
}
export function customMessage(kind, details, portions, zone, date, notes = '') {
  return [
    '¡Hola, Chefelpi! Quisiera consultar por una comida personalizada.',
    `Tipo de comida: ${kind}.`, `Preparación: ${details}.`,
    `Porciones: ${portions}.`, `Zona de entrega: ${zone}.`,
    `Fecha deseada: ${date}.`, notes.trim() ? `Preferencias: ${notes.trim()}.` : '',
    '¿Podés confirmarme disponibilidad y presupuesto?',
  ].filter(Boolean).join('\n');
}
export function bookMessage(title) {
  return `¡Hola, Chefelpi! Estoy interesado en comprar el recetario digital ${title} en formato PDF. ¿Podrías indicarme cómo realizar el pago y recibirlo?`;
}
