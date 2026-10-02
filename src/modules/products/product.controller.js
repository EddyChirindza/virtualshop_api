// ─────────────────────────────────────────────
// VirtualShop API — Controlador de produtos
// ─────────────────────────────────────────────
const productService = require('./product.service');
const { ApiError } = require('../../middlewares/error.middleware');
const { productListSchema } = require('./product.validators');

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
    const params = productListSchema.parse(req.query);
    const result = await productService.getAll({
      q: params.q || undefined,
      categoryId: params.category ?? params.category_id,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      sort: params.sort,
      page: params.page ?? 1,
      limit: params.limit ?? params.page_size ?? 20,
    });
    res.json({ success: true, message: 'OK', ...result });
  } catch (err) {
    next(err);
  }
}

module.exports = { popular, newArrivals, detail, list };
