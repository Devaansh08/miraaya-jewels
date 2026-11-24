-- ═══════════════════════════════════════════════════════════════
--  MIRAAYA JEWELS — MySQL Database Schema
--  Run this file in MySQL Workbench or via CLI:
--    mysql -u root -p < database/schema.sql
-- ═══════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS miraaya_jewels
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE miraaya_jewels;

-- ── Users ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)    NOT NULL,
  email         VARCHAR(191)    NOT NULL,
  password_hash VARCHAR(255)    NOT NULL,
  role          ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  phone         VARCHAR(20)     DEFAULT NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Products ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name          VARCHAR(255)    NOT NULL,
  slug          VARCHAR(255)    NOT NULL,
  description   TEXT            DEFAULT NULL,
  price         DECIMAL(10,2)   NOT NULL,
  mrp           DECIMAL(10,2)   DEFAULT NULL COMMENT 'Original / list price',
  category      VARCHAR(80)     NOT NULL,
  image_url     VARCHAR(500)    DEFAULT NULL,
  specs         JSON            DEFAULT NULL COMMENT 'Array of [key, value] pairs',
  stock         INT UNSIGNED    NOT NULL DEFAULT 50,
  is_featured   TINYINT(1)      NOT NULL DEFAULT 0,
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_category (category),
  KEY idx_products_featured  (is_featured),
  KEY idx_products_active    (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Orders ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id          INT UNSIGNED  NOT NULL,
  order_number     VARCHAR(50)   NOT NULL,
  total            DECIMAL(10,2) NOT NULL,
  shipping_charge  DECIMAL(10,2) NOT NULL DEFAULT 0,
  status           ENUM('pending','confirmed','processing','shipped','delivered','cancelled','returned')
                                 NOT NULL DEFAULT 'pending',
  payment_method   VARCHAR(50)   NOT NULL DEFAULT 'cod',
  payment_status   ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  tracking_number  VARCHAR(100)  DEFAULT NULL,
  shipping_address JSON          DEFAULT NULL,
  cancel_reason    TEXT          DEFAULT NULL,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_number (order_number),
  KEY idx_orders_user   (user_id),
  KEY idx_orders_status (status),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Order Items ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  order_id    INT UNSIGNED    NOT NULL,
  product_id  INT UNSIGNED    NOT NULL,
  qty         INT UNSIGNED    NOT NULL DEFAULT 1,
  price       DECIMAL(10,2)   NOT NULL COMMENT 'Price at time of purchase',
  PRIMARY KEY (id),
  KEY idx_oi_order   (order_id),
  KEY idx_oi_product (product_id),
  CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Wishlist ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED  NOT NULL,
  product_id  INT UNSIGNED  NOT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wishlist (user_id, product_id),
  CONSTRAINT fk_wl_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_wl_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Cart (server-side, supplements localStorage) ───────────────
CREATE TABLE IF NOT EXISTS cart (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED  NOT NULL,
  product_id  INT UNSIGNED  NOT NULL,
  qty         INT UNSIGNED  NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cart (user_id, product_id),
  CONSTRAINT fk_cart_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Newsletter Subscribers ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  email       VARCHAR(191)  NOT NULL,
  subscribed  TINYINT(1)    NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_newsletter_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Contact Messages ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(191)  NOT NULL,
  subject     VARCHAR(255)  DEFAULT 'General Enquiry',
  message     TEXT          NOT NULL,
  is_read     TINYINT(1)    NOT NULL DEFAULT 0,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Schema created successfully!' AS result;

