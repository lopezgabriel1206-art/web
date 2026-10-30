import test from 'node:test';
import assert from 'node:assert/strict';
import { whatsappLink, dishMessage, customMessage, bookMessage } from '../src/lib/whatsapp-core.mjs';
test('número E.164 sin +, sin enlaces ficticios', () => {
  assert.equal(whatsappLink('', 'hola'), null);
  assert.equal(whatsappLink('123', 'hola'), null);
  assert.equal(whatsappLink('+54 11 1234-5678', 'Hola mundo'), 'https://wa.me/541112345678?text=Hola%20mundo');
});
test('mensajes contextuales comprensibles y codificados', () => {
  const d = dishMessage('Paella',2,'Centro','2026-12-05');
  assert.match(d,/Paella/); assert.match(d,/Cantidad: 2/);
  assert.match(customMessage('Postre','Tarta',4,'Norte','2026-11-10'),/Tarta/);
  assert.match(bookMessage('Recetas caseras'),/formato PDF/);
  const link = whatsappLink('541112345678','¿Qué tal?');
  assert.ok(link?.includes('%C2%BFQu%C3%A9%20tal%3F'));
});
