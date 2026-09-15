// ─────────────────────────────────────────────
// VirtualShop API — Rotas de categorias
// ─────────────────────────────────────────────
const { Router } = require('express');
const controller = require('./category.controller');

const router = Router();

// Pública — não exige autenticação (é preciso ver o catálogo antes de entrar)
router.get('/', controller.list);

module.exports = router;
