-- Migration 001: Create categories table

CREATE TABLE IF NOT EXISTS categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Seed default categories
INSERT INTO categories (name, description) VALUES
  ('Research Peptides',     'For laboratory and academic research use'),
  ('Cosmetic Peptides',     'Anti-aging and skin care applications'),
  ('Performance Peptides',  'Athletic recovery and performance'),
  ('Therapeutic Peptides',  'Medical and pharmaceutical applications'),
  ('Custom Peptides',       'Fully custom sequences and modifications')
ON CONFLICT (name) DO NOTHING;
