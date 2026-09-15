// ─────────────────────────────────────────────
// VirtualShop API — Controlador de produtos
// ─────────────────────────────────────────────
const productService = require('./product.service');
const { ApiError } = require('../../middlewares/error.middleware');

async function popular(req, res, next) {
  try {
    const data = await productService.getPopular();
    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
}

async function newArrivals(req, res, next) {
  try {
    const data = await productService.getNewArrivals();
    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
}

async function detail(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ApiError(400, 'Id de produto inválido.');
    }
    const data = await productService.getById(id);
    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const categoryId = req.query.category_id ? Number(req.query.category_id) : undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const pageSize = req.query.page_size ? Number(req.query.page_size) : 20;

    if (categoryId !== undefined && (!Number.isInteger(categoryId) || categoryId <= 0)) {
      throw new ApiError(400, 'category_id inválido.');
    }
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
      throw new ApiError(400, 'Parâmetros de paginação inválidos.');
    }

    const data = await productService.getAll({ categoryId, page, pageSize });
    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
}

module.exports = { popular, newArrivals, detail, list };
