-- =========================================================
-- data.sql — Datos de prueba
-- Proyecto: Camila Manrique — Tienda de Bolsos y Marroquinería
-- =========================================================

USE camila_db;

-- ---------------------------------------------------------
-- Categorías (mínimo 3)
-- ---------------------------------------------------------
INSERT INTO Categories (nombre, createdAt, updatedAt) VALUES
('Tote',      NOW(), NOW()),
('Bandolera', NOW(), NOW()),
('Mini Bag',  NOW(), NOW()),
('Morral',    NOW(), NOW()),
('Clutch',    NOW(), NOW());

-- ---------------------------------------------------------
-- Usuarios de prueba
-- Contraseña en texto plano: Admin1234
-- Hash bcrypt (cost 10): $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9S
-- ---------------------------------------------------------
INSERT INTO Users (nombre, apellido, email, password, rol, imagen, createdAt, updatedAt) VALUES
(
    'Camila',
    'Manrique',
    'admin@camilamanrique.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9S',
    'admin',
    NULL,
    NOW(),
    NOW()
),
(
    'Laura',
    'Gómez',
    'laura@ejemplo.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9S',
    'user',
    NULL,
    NOW(),
    NOW()
);

-- ---------------------------------------------------------
-- Productos (mínimo 5, precios en COP)
-- categoryId referencia: 1=Tote, 2=Bandolera, 3=Mini Bag, 4=Morral, 5=Clutch
-- ---------------------------------------------------------
INSERT INTO Products (nombre, descripcion, precio, imagen, stock, inOffer, categoryId, createdAt, updatedAt) VALUES
('Tote Bag Cuero Natural',    'Bolso tote en cuero natural colombiano, costuras reforzadas.',        285000.00, NULL, 10, 0, 1, NOW(), NOW()),
('Bandolera Artesanal Wayuu', 'Bandolera tejida a mano con motivos Wayuu, correa ajustable.',        195000.00, NULL, 15, 1, 2, NOW(), NOW()),
('Mini Bag Charol Negro',     'Mini bolso en charol negro, diseño compacto para salidas nocturnas.', 165000.00, NULL,  8, 0, 3, NOW(), NOW()),
('Morral Aventurero Lona',    'Morral en lona resistente al agua, múltiples compartimentos.',        220000.00, NULL, 12, 0, 4, NOW(), NOW()),
('Clutch Dorado Fiesta',      'Clutch dorado con cadena removible, ideal para eventos formales.',    135000.00, NULL, 20, 1, 5, NOW(), NOW()),
('Tote Cáñamo Ecológico',     'Bolso tote sustentable en cáñamo orgánico, bolsillo interior.',      145000.00, NULL, 25, 0, 1, NOW(), NOW());
