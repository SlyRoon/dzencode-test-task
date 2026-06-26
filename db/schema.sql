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
  ('Order 1', '2017-06-29 12:09:33', 'Long term storage delivery'),
  ('Order 2', '2017-06-29 12:09:33', 'Office equipment batch');

INSERT INTO products
  (serial_number, is_new, photo, title, type, specification,
   guarantee_start, guarantee_end, order_id, date)
VALUES
  ('1234', 1, 'pathToFile.jpg', 'Product 1', 'Monitors', 'Specification 1',
   '2017-06-29 12:09:33', '2017-06-29 12:09:33', 1, '2017-06-29 12:09:33'),
  ('5678', 0, 'pathToFile.jpg', 'Product 2', 'Laptops', 'Specification 2',
   '2017-06-29 12:09:33', '2018-06-29 12:09:33', 2, '2017-06-29 12:09:33');

INSERT INTO prices (product_id, value, symbol, is_default) VALUES
  (1, 100.00, 'USD', 0),
  (1, 2600.00, 'UAH', 1),
  (2, 150.00, 'USD', 0),
  (2, 3900.00, 'UAH', 1);
