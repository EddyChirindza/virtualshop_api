// ─────────────────────────────────────────────
// VirtualShop API — Controlador de categorias
// ─────────────────────────────────────────────
const categoryService = require('./category.service');

async function list(req, res, next) {
  try {
    // ?tree=true devolve a árvore (pai → filhos) em vez da lista achatada
    const data = req.query.tree === 'true'
      ? await categoryService.getTree()
      : await categoryService.getAll();

    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
}

module.exports = { list };
