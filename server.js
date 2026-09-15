// ─────────────────────────────────────────────
// VirtualShop API — Ponto de entrada
// ─────────────────────────────────────────────
const app = require('./src/app');
const env = require('./src/config/env');

app.listen(env.port, () => {
  console.log(`[server] VirtualShop API a correr em http://localhost:${env.port}`);
});
