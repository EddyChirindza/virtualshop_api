-- Dados de teste — corre com: npm run seed
-- Seguro para correr várias vezes (ON CONFLICT ... DO NOTHING)

INSERT INTO categories (name, slug, icon_url, parent_id) VALUES
    ('Frutas e Legumes', 'frutas-legumes', NULL, NULL),
    ('Padaria', 'padaria', NULL, NULL),
    ('Bebidas', 'bebidas', NULL, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, icon_url, parent_id)
SELECT 'Frutas', 'frutas', NULL, id FROM categories WHERE slug = 'frutas-legumes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, icon_url, parent_id)
SELECT 'Legumes', 'legumes', NULL, id FROM categories WHERE slug = 'frutas-legumes'
ON CONFLICT (slug) DO NOTHING;

-- products não tem uma coluna única de negócio, por isso usamos
-- WHERE NOT EXISTS (por nome) para manter o seed idempotente.
INSERT INTO products (name, description, price, stock, image_url, category_id, rating, is_popular, is_new_arrival)
SELECT 'Maçã Fuji (kg)', 'Maçãs frescas e crocantes.', 150.00, 80,
       'https://example.com/images/maca.jpg', id, 4.5, true, false
FROM categories WHERE slug = 'frutas'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Maçã Fuji (kg)');

INSERT INTO products (name, description, price, stock, image_url, category_id, rating, is_popular, is_new_arrival)
SELECT 'Banana Prata (dúzia)', 'Bananas maduras, doces.', 90.00, 120,
       'https://example.com/images/banana.jpg', id, 4.2, true, false
FROM categories WHERE slug = 'frutas'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Banana Prata (dúzia)');

INSERT INTO products (name, description, price, stock, image_url, category_id, rating, is_popular, is_new_arrival)
SELECT 'Pão de Forma Integral', 'Pão fresco, assado todos os dias.', 120.00, 40,
       'https://example.com/images/pao.jpg', id, 4.0, false, true
FROM categories WHERE slug = 'padaria'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pão de Forma Integral');

INSERT INTO products (name, description, price, stock, image_url, category_id, rating, is_popular, is_new_arrival)
SELECT 'Água Mineral 1.5L', 'Água mineral natural.', 60.00, 200,
       'https://example.com/images/agua.jpg', id, 4.8, true, true
FROM categories WHERE slug = 'bebidas'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Água Mineral 1.5L');
