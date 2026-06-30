-- =====================================================================
-- Inventory database schema
-- Domain: Orders (Приходы) & Products (Продукты)
-- Compatible with MySQL 8+ / MySQL Workbench
-- =====================================================================

CREATE DATABASE IF NOT EXISTS inventory
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE inventory;

-- Drop in dependency order (children first) to allow clean re-runs.
DROP TABLE IF EXISTS prices;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS orders;

-- ---------------------------------------------------------------------
-- orders (Приходы): a logical batch / incoming delivery of products.
-- ---------------------------------------------------------------------
CREATE TABLE orders (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  date        DATETIME NOT NULL,
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- products (Продукты): items that belong to an order.
-- Deleting an order cascades to its products.
-- ---------------------------------------------------------------------
CREATE TABLE products (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  serial_number   VARCHAR(64),
  is_new          TINYINT(1) NOT NULL DEFAULT 1,   -- 1 = new, 0 = used
  photo           VARCHAR(255),
  title           VARCHAR(255) NOT NULL,
  type            VARCHAR(128),                     -- e.g. Monitors, Laptops
  specification   VARCHAR(255),
  guarantee_start DATETIME,
  guarantee_end   DATETIME,
  order_id        INT,
  date            DATETIME,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- prices: one product may have several prices (different currencies).
-- is_default marks the price shown by default in the UI.
-- ---------------------------------------------------------------------
CREATE TABLE prices (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  value      DECIMAL(12,2) NOT NULL,
  symbol     VARCHAR(8) NOT NULL,                   -- e.g. USD, UAH
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Sample data
-- =====================================================================

INSERT INTO orders (title, date, description) VALUES
  ('Длинное предлинное длиннючее название прихода', '2017-09-06 12:09:33', 'Партия мониторов для главного офиса'),
  ('Приход серверного оборудования и рабочих станций', '2017-09-12 10:15:00', 'Техника для инфраструктурного отдела'),
  ('Поставка периферии и сетевого оборудования', '2017-10-03 15:45:10', 'Клавиатуры, мыши, роутеры и коммутаторы'),
  ('Тестовый приход техники для отдела продаж', '2017-11-18 09:30:25', 'Ноутбуки и презентационные дисплеи');

INSERT INTO products
  (serial_number, is_new, photo, title, type, specification,
   guarantee_start, guarantee_end, order_id, date)
VALUES
  ('123456789', 1, 'pathToFile.jpg', 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3', 'Monitors', 'Длинное предлинное длиннючее название группы',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 1, '2017-09-06 12:09:33'),
  ('123456790', 0, 'pathToFile.jpg', 'Dell UltraSharp U2412M 24-inch IPS Monitor', 'Laptops', 'Рабочие места бухгалтерии',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 2, '2017-09-12 10:15:00'),
  ('123456791', 1, 'pathToFile.jpg', 'Apple Thunderbolt Display 27-inch A1407', 'Desktops', 'Христорождественский Александр',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 3, '2017-10-03 15:45:10'),
  ('123456792', 1, 'pathToFile.jpg', 'Lenovo ThinkPad T480 Corporate Edition', 'Network', 'Складской резерв и замена',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 4, '2017-11-18 09:30:25'),
  ('123456793', 0, 'pathToFile.jpg', 'HP ProDesk 600 G4 Small Form Factor', 'Accessories', 'Техника переговорных комнат',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 1, '2017-09-06 12:09:33'),
  ('123456794', 1, 'pathToFile.jpg', 'Cisco Catalyst 2960-X 24 Port Switch', 'Monitors', 'Длинное предлинное длиннючее название группы',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 2, '2017-09-12 10:15:00'),
  ('123456795', 1, 'pathToFile.jpg', 'Logitech MX Keys Advanced Wireless Keyboard', 'Laptops', 'Рабочие места бухгалтерии',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 3, '2017-10-03 15:45:10'),
  ('123456796', 0, 'pathToFile.jpg', 'Samsung Odyssey G5 Curved Gaming Monitor', 'Desktops', 'Христорождественский Александр',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 4, '2017-11-18 09:30:25'),
  ('123456797', 1, 'pathToFile.jpg', 'ASUS ProArt Display PA278QV Calibrated Monitor', 'Network', 'Складской резерв и замена',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 1, '2017-09-06 12:09:33'),
  ('123456798', 1, 'pathToFile.jpg', 'Intel NUC 11 Performance Mini PC', 'Accessories', 'Техника переговорных комнат',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 2, '2017-09-12 10:15:00'),
  ('123456799', 0, 'pathToFile.jpg', 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3', 'Monitors', 'Длинное предлинное длиннючее название группы',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 3, '2017-10-03 15:45:10'),
  ('123456800', 1, 'pathToFile.jpg', 'Dell UltraSharp U2412M 24-inch IPS Monitor', 'Laptops', 'Рабочие места бухгалтерии',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 4, '2017-11-18 09:30:25'),
  ('123456801', 1, 'pathToFile.jpg', 'Apple Thunderbolt Display 27-inch A1407', 'Desktops', 'Христорождественский Александр',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 1, '2017-09-06 12:09:33'),
  ('123456802', 0, 'pathToFile.jpg', 'Lenovo ThinkPad T480 Corporate Edition', 'Network', 'Складской резерв и замена',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 2, '2017-09-12 10:15:00'),
  ('123456803', 1, 'pathToFile.jpg', 'HP ProDesk 600 G4 Small Form Factor', 'Accessories', 'Техника переговорных комнат',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 3, '2017-10-03 15:45:10'),
  ('123456804', 1, 'pathToFile.jpg', 'Cisco Catalyst 2960-X 24 Port Switch', 'Monitors', 'Длинное предлинное длиннючее название группы',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 4, '2017-11-18 09:30:25'),
  ('123456805', 0, 'pathToFile.jpg', 'Logitech MX Keys Advanced Wireless Keyboard', 'Laptops', 'Рабочие места бухгалтерии',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 1, '2017-09-06 12:09:33'),
  ('123456806', 1, 'pathToFile.jpg', 'Samsung Odyssey G5 Curved Gaming Monitor', 'Desktops', 'Христорождественский Александр',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 2, '2017-09-12 10:15:00'),
  ('123456807', 1, 'pathToFile.jpg', 'ASUS ProArt Display PA278QV Calibrated Monitor', 'Network', 'Складской резерв и замена',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 3, '2017-10-03 15:45:10'),
  ('123456808', 0, 'pathToFile.jpg', 'Intel NUC 11 Performance Mini PC', 'Accessories', 'Техника переговорных комнат',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 4, '2017-11-18 09:30:25'),
  ('123456809', 1, 'pathToFile.jpg', 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3', 'Monitors', 'Длинное предлинное длиннючее название группы',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 1, '2017-09-06 12:09:33'),
  ('123456810', 1, 'pathToFile.jpg', 'Dell UltraSharp U2412M 24-inch IPS Monitor', 'Laptops', 'Рабочие места бухгалтерии',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 2, '2017-09-12 10:15:00'),
  ('123456811', 0, 'pathToFile.jpg', 'Apple Thunderbolt Display 27-inch A1407', 'Desktops', 'Христорождественский Александр',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 3, '2017-10-03 15:45:10'),
  ('123456812', 1, 'pathToFile.jpg', 'Lenovo ThinkPad T480 Corporate Edition', 'Network', 'Складской резерв и замена',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 4, '2017-11-18 09:30:25'),
  ('123456813', 1, 'pathToFile.jpg', 'HP ProDesk 600 G4 Small Form Factor', 'Accessories', 'Техника переговорных комнат',
   '2017-04-06 12:00:00', '2025-08-06 12:00:00', 1, '2017-09-06 12:09:33');

INSERT INTO prices (product_id, value, symbol, is_default) VALUES
  (1, 110.00, 'USD', 0),
  (1, 2860.00, 'UAH', 1),
  (2, 145.00, 'USD', 0),
  (2, 3770.00, 'UAH', 1),
  (3, 180.00, 'USD', 0),
  (3, 4680.00, 'UAH', 1),
  (4, 215.00, 'USD', 0),
  (4, 5590.00, 'UAH', 1),
  (5, 250.00, 'USD', 0),
  (5, 6500.00, 'UAH', 1),
  (6, 285.00, 'USD', 0),
  (6, 7410.00, 'UAH', 1),
  (7, 320.00, 'USD', 0),
  (7, 8320.00, 'UAH', 1),
  (8, 355.00, 'USD', 0),
  (8, 9230.00, 'UAH', 1),
  (9, 390.00, 'USD', 0),
  (9, 10140.00, 'UAH', 1),
  (10, 425.00, 'USD', 0),
  (10, 11050.00, 'UAH', 1),
  (11, 460.00, 'USD', 0),
  (11, 11960.00, 'UAH', 1),
  (12, 495.00, 'USD', 0),
  (12, 12870.00, 'UAH', 1),
  (13, 530.00, 'USD', 0),
  (13, 13780.00, 'UAH', 1),
  (14, 565.00, 'USD', 0),
  (14, 14690.00, 'UAH', 1),
  (15, 600.00, 'USD', 0),
  (15, 15600.00, 'UAH', 1),
  (16, 635.00, 'USD', 0),
  (16, 16510.00, 'UAH', 1),
  (17, 670.00, 'USD', 0),
  (17, 17420.00, 'UAH', 1),
  (18, 705.00, 'USD', 0),
  (18, 18330.00, 'UAH', 1),
  (19, 740.00, 'USD', 0),
  (19, 19240.00, 'UAH', 1),
  (20, 775.00, 'USD', 0),
  (20, 20150.00, 'UAH', 1),
  (21, 810.00, 'USD', 0),
  (21, 21060.00, 'UAH', 1),
  (22, 845.00, 'USD', 0),
  (22, 21970.00, 'UAH', 1),
  (23, 880.00, 'USD', 0),
  (23, 22880.00, 'UAH', 1),
  (24, 915.00, 'USD', 0),
  (24, 23790.00, 'UAH', 1),
  (25, 950.00, 'USD', 0),
  (25, 24700.00, 'UAH', 1);
