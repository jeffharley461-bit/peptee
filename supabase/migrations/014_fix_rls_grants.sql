-- Migration 014: Fix RLS grants for public read access
-- Ensures anon/authenticated can read tables intended to be public

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON price_list TO anon, authenticated;
GRANT SELECT ON settings TO anon, authenticated;
GRANT SELECT ON test_reports TO anon, authenticated;

-- Newsletter: only allow inserts from anon/authenticated (RLS already exists)
GRANT INSERT ON newsletter_subscribers TO anon, authenticated;

-- Inquiries: inserts from anon/authenticated; reads/updates restricted to authenticated (admin)
GRANT INSERT ON inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON inquiries TO authenticated;
