// ─────────────────────────────────────────────
// VirtualShop API — Serviço de categorias
// ─────────────────────────────────────────────
const { query } = require('../../config/db');

// Lista simples (achatada) — é o que o customer_app espera hoje
async function getAll() {
  const { rows } = await query(
    `SELECT id, name, slug, icon_url, parent_id
     FROM categories
     ORDER BY name ASC`
  );
  return rows;
}

// Árvore de categorias (pai → filhos), para uso futuro (ex: menu com subcategorias)
async function getTree() {
  const flat = await getAll();
  const byId = new Map(flat.map((c) => [c.id, { ...c, children: [] }]));
  const roots = [];

  for (const category of byId.values()) {
    if (category.parent_id && byId.has(category.parent_id)) {
      byId.get(category.parent_id).children.push(category);
    } else {
      roots.push(category);
    }
  }

  return roots;
}

module.exports = { getAll, getTree };
