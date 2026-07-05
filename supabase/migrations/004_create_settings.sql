-- Migration 004: Create settings table (singleton row)

CREATE TABLE IF NOT EXISTS settings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name    text    NOT NULL DEFAULT 'PeptideForge',
  company_email   text    DEFAULT 'jeffharley461@gmail.com',
  company_phone   text,
  whatsapp_number text,
  logo_url        text,
  currency        text    NOT NULL DEFAULT 'USD',
  date_format     text    NOT NULL DEFAULT 'MM/DD/YYYY',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed exactly one row
INSERT INTO settings (company_name, company_email)
SELECT 'PeptideForge', 'jeffharley461@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM settings);
