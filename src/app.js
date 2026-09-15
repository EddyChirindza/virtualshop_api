// ─────────────────────────────────────────────
// VirtualShop API — Configuração da app Express
// ─────────────────────────────────────────────
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const authRoutes = require('./modules/auth/auth.routes');
// Os módulos de categories e products entram aqui nos próximos passos:
// const categoryRoutes = require('./modules/categories/category.routes');
// const productRoutes = require('./modules/products/product.routes');

const app = express();

// ── Segurança / infra base ───────────────────
app.set('trust proxy', 1); // necessário para req.ip correcto atrás de proxy/load balancer
app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigins.length > 0 ? env.corsOrigins : false,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

// ── Healthcheck ───────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'VirtualShop API operacional.' });
});

// ── Rotas ──────────────────────────────────────
app.use('/api/auth', authRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/products', productRoutes);

// ── 404 + erros ────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
