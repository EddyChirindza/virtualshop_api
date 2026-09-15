// ─────────────────────────────────────────────
// VirtualShop API — Rotas de produtos
//
// Nota de ordem: as rotas específicas (/popular, /new-arrivals)
// têm de vir ANTES de /:id, senão o Express tenta interpretar
// "popular" como um id.
// ─────────────────────────────────────────────
const { Router } = require('express');
const controller = require('./product.controller');

const router = Router();

router.get('/popular', controller.popular);
router.get('/new-arrivals', controller.newArrivals);
router.get('/:id', controller.detail);
router.get('/', controller.list);

module.exports = router;
