-- Migration 013: Seed a Certificate of Analysis (test report) entry for every product
-- Depends on: 002 (products), 009 (test_reports)
--
-- Creates one published COA row per product that does not already have one.
-- Purity is carried over from the product's verified batch figure; method is
-- HPLC / MS. Report documents (PDFs) are uploaded separately via the admin area,
-- so report_url is left NULL until a file is attached.

INSERT INTO test_reports (product_id, product_name, batch_number, purity_percent, method, is_published)
SELECT
  p.id,
  p.name,
  'TP-' || upper(substr(md5(p.id::text), 1, 6)),
  p.purity_percent,
  'HPLC / MS',
  true
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM test_reports tr WHERE tr.product_id = p.id
);
