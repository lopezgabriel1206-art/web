'use strict';
// Punto de entrada para cPanel/Passenger.
// No publica archivos directamente: usa las rutas y protecciones de Next.js.
const http = require('node:http');
const next = require('next');

const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const rawPort = process.env.PORT;
    const listenTarget = rawPort && /^\d+$/.test(rawPort) ? Number(rawPort) : (rawPort || 3000);
    const server = http.createServer((req, res) => handle(req, res));
    server.on('error', (error) => {
      console.error('[CHEFELPI] Error HTTP:', error);
      process.exitCode = 1;
    });
    // Passenger puede proporcionar un puerto numérico o una ruta de socket.
    server.listen(listenTarget, () => console.log('[CHEFELPI] Servidor Next.js iniciado.'));
  })
  .catch((error) => {
    console.error('[CHEFELPI] Error al preparar Next.js:', error);
    process.exitCode = 1;
  });
