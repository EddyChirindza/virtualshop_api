// ─────────────────────────────────────────────
// VirtualShop API — Configuração da app Express
// ─────────────────────────────────────────────
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const authRoutes = require('./modules/auth/auth.routes');
const categoryRoutes = require('./modules/categories/category.routes');
const productRoutes = require('./modules/products/product.routes');
const cartRoutes = require('./modules/cart/cart.routes');
const orderRoutes = require('./modules/orders/order.routes');

const app = express();

// ── Segurança / infra base ───────────────────
// ── Segurança / infra base ───────────────────
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      const rejectOrigin = (message) => {
        const error = new Error(message);
        error.statusCode = 403;
        return callback(error);
      };

      if (env.nodeEnv === 'development') {
        // Permite pedidos sem Origin (Postman, apps mobile, curl)
        if (!origin) return callback(null, true);

        const localhostOrigin = origin.match(/^https?:\/\/(localhost|127\.0\.0\.1):(\d{1,5})$/);
        if (localhostOrigin && Number(localhostOrigin[2]) <= 65535) {
          return callback(null, true);
        }

        return rejectOrigin(`Origem não permitida: ${origin}`);
      }

      if (env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return rejectOrigin(`Origem não permitida: ${origin || 'ausência de Origin'}`);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

// ── Healthcheck ───────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'VirtualShop API operacional.' });
});

// ── Rotas ──────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// ── 404 + erros ────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
