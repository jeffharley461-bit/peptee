-- Migration 010: Add stock status to products

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS stock_status text NOT NULL DEFAULT 'in_stock';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_stock_status_check'
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_stock_status_check
      CHECK (stock_status IN ('in_stock','low_stock','out_of_stock','pre_order'));
  END IF;
END $$;
