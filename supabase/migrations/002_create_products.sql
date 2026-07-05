-- Migration 002: Create products table with auto-updated timestamp

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS products (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id           uuid REFERENCES categories(id) ON DELETE SET NULL,
  name                  text NOT NULL,
  description           text,
  applications          text[],
  purity_percent        numeric(5,2)  CHECK (purity_percent >= 0 AND purity_percent <= 100),
  molecular_weight      numeric(12,4),
  molecular_weight_unit text NOT NULL DEFAULT 'Da' CHECK (molecular_weight_unit IN ('Da','kDa')),
  amino_acid_sequence   text,
  price_usd             numeric(10,2) CHECK (price_usd >= 0),
  image_url             text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Sample products (optional — remove in production)
-- INSERT INTO products (name, description, purity_percent, price_usd) VALUES
--   ('BPC-157', 'Body Protection Compound for research', 99.5, 49.99),
--   ('TB-500', 'Thymosin Beta-4 analogue for research', 98.8, 59.99);
