// ─────────────────────────────────────────────
// VirtualShop API — Serviço de produtos
// ─────────────────────────────────────────────
const { query } = require('../../config/db');
const { ApiError } = require('../../middlewares/error.middleware');

// category_name vem de um JOIN — é o que o ProductModel do Flutter espera
const BASE_SELECT = `
  SELECT p.id, p.name, p.description, p.price, p.stock, p.image_url,
         p.rating, p.is_popular, p.is_new_arrival,
         c.name AS category_name
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
`;

async function getPopular() {
  const { rows } = await query(
    `${BASE_SELECT} WHERE p.is_popular = true ORDER BY p.rating DESC, p.id DESC`
  );
  return rows;
}

async function getNewArrivals() {
  const { rows } = await query(
    `${BASE_SELECT} WHERE p.is_new_arrival = true ORDER BY p.created_at DESC`
  );
  return rows;
}

async function getById(id) {
  const { rows } = await query(`${BASE_SELECT} WHERE p.id = $1`, [id]);
  if (!rows[0]) {
    throw new ApiError(404, 'Produto não encontrado.');
  }
  return rows[0];
}

// Lista geral com filtro opcional por categoria e paginação — para uso futuro
// (ex: ecrã de listagem completa do catálogo)
async function getAll({ categoryId, page = 1, pageSize = 20 }) {
  const conditions = [];
  const params = [];

  if (categoryId) {
    params.push(categoryId);
    conditions.push(`p.category_id = $${params.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * pageSize;

  params.push(pageSize, offset);
  const { rows } = await query(
    `${BASE_SELECT} ${whereClause} ORDER BY p.id DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return rows;
}

module.exports = { getPopular, getNewArrivals, getById, getAll };
