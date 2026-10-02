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

async function getAll({ q, categoryId, minPrice, maxPrice, sort, page = 1, limit = 20 }) {
  const conditions = [];
  const params = [];
  let categoryCte = '';
  let searchOrderParams;

  if (categoryId) {
    params.push(categoryId);
    categoryCte = `WITH RECURSIVE category_tree AS (
      SELECT id FROM categories WHERE id = $${params.length}
      UNION
      SELECT c.id FROM categories c
      JOIN category_tree parent ON c.parent_id = parent.id
    )`;
    conditions.push('p.category_id IN (SELECT id FROM category_tree)');
  }

  if (q) {
    const escapedQuery = q.replace(/[\\%_]/g, '\\$&');
    params.push(`${escapedQuery}%`);
    const startsWithParam = `$${params.length}`;
    params.push(`%${escapedQuery}%`);
    const containsParam = `$${params.length}`;
    searchOrderParams = { startsWithParam, containsParam };
    conditions.push(`(p.name ILIKE ${startsWithParam} ESCAPE '\\' OR p.name ILIKE ${containsParam} ESCAPE '\\' OR p.description ILIKE ${containsParam} ESCAPE '\\')`);
  }

  if (minPrice !== undefined) {
    params.push(minPrice);
    conditions.push(`p.price >= $${params.length}`);
  }

  if (maxPrice !== undefined) {
    params.push(maxPrice);
    conditions.push(`p.price <= $${params.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const filters = [...params];
  const countResult = await query(
    `${categoryCte} SELECT COUNT(*)::int AS total FROM products p ${whereClause}`,
    filters
  );

  const selectedSort = sort || (q ? 'relevance' : 'newest');
  let orderBy = 'p.created_at DESC, p.id DESC';
  if (selectedSort === 'price_asc') orderBy = 'p.price ASC, p.id DESC';
  if (selectedSort === 'price_desc') orderBy = 'p.price DESC, p.id DESC';
  if (selectedSort === 'relevance' && q) {
    const { startsWithParam, containsParam } = searchOrderParams;
    orderBy = `CASE WHEN p.name ILIKE ${startsWithParam} ESCAPE '\\' THEN 0
                    WHEN p.name ILIKE ${containsParam} ESCAPE '\\' THEN 1
                    ELSE 2 END, p.created_at DESC, p.id DESC`;
  }

  const offset = (page - 1) * limit;

  params.push(limit, offset);
  const { rows } = await query(
    `${categoryCte} ${BASE_SELECT} ${whereClause} ORDER BY ${orderBy} LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const total = countResult.rows[0].total;
  return { data: rows, page, limit, total, totalPages: Math.ceil(total / limit) };
}

module.exports = { getPopular, getNewArrivals, getById, getAll };
