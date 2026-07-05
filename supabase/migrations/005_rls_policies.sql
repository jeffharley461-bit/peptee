-- Migration 005: Row Level Security policies
-- Run AFTER 001-004 and after enabling Auth in Supabase dashboard

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings   ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CATEGORIES: public read, admin write
-- ============================================================
DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories"
  ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "admin_all_categories" ON categories;
CREATE POLICY "admin_all_categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- PRODUCTS: public read, admin write
-- ============================================================
DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products"
  ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "admin_all_products" ON products;
CREATE POLICY "admin_all_products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- INQUIRIES: public insert only, admin full access
-- ============================================================
DROP POLICY IF EXISTS "public_insert_inquiries" ON inquiries;
CREATE POLICY "public_insert_inquiries"
  ON inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "admin_all_inquiries" ON inquiries;
CREATE POLICY "admin_all_inquiries"
  ON inquiries FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- SETTINGS: admin full access only
-- ============================================================
DROP POLICY IF EXISTS "admin_all_settings" ON settings;
CREATE POLICY "admin_all_settings"
  ON settings FOR ALL
  USING (auth.role() = 'authenticated');
