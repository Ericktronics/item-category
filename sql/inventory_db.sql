-- create_inventory_db.sql
-- PostgreSQL script to create an inventory database with category and item tables
-- Usage (from shell):
--   psql -f sql/create_users_db.sql
-- or run the sections step-by-step in psql.

-- 1) Create the database (run as a superuser or a user that can create DBs)
CREATE DATABASE inventory_db;

-- If running the rest of this file from your client, switch to the new DB with psql's \connect:
-- \connect inventory_db

-- 2) The following statements assume you are connected to `inventory_db`.
-- Enable the `pgcrypto` extension for UUID generation.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 3) Create the `category` table
CREATE TABLE IF NOT EXISTS category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4) Create the `item` table with foreign key to category
CREATE TABLE IF NOT EXISTS item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES category(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INT NOT NULL DEFAULT 0,
  price DECIMAL(10, 2),
  sku VARCHAR(100) UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5) Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_item_category_id ON item(category_id);
CREATE INDEX IF NOT EXISTS idx_item_name ON item(name);
CREATE INDEX IF NOT EXISTS idx_category_name ON category(name);

-- 6) Example seed data
INSERT INTO category (name, description)
VALUES 
  ('Electronics', 'Electronic devices and components'),
  ('Books', 'Physical and digital books'),
  ('Clothing', 'Apparel and accessories');

-- Insert sample items
INSERT INTO item (category_id, name, description, quantity, price, sku)
SELECT id, 'Laptop', 'High-performance laptop', 5, 999.99, 'SKU-LAPTOP-001'
FROM category WHERE name = 'Electronics'
UNION ALL
SELECT id, 'Mouse', 'Wireless mouse', 15, 29.99, 'SKU-MOUSE-001'
FROM category WHERE name = 'Electronics'
UNION ALL
SELECT id, 'The Great Gatsby', 'Classic American novel', 8, 12.99, 'SKU-BOOK-001'
FROM category WHERE name = 'Books'
UNION ALL
SELECT id, 'T-Shirt', 'Cotton t-shirt', 25, 19.99, 'SKU-SHIRT-001'
FROM category WHERE name = 'Clothing';

-- 7) Helpful queries
-- Show all categories:
-- SELECT * FROM category;

-- Show all items with category:
-- SELECT i.name, i.quantity, i.price, c.name AS category FROM item i 
-- JOIN category c ON i.category_id = c.id;

-- Show items by category:
-- SELECT i.* FROM item i 
-- JOIN category c ON i.category_id = c.id 
-- WHERE c.name = 'Electronics';
