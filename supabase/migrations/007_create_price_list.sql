CREATE TABLE IF NOT EXISTS price_list (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  category      text,
  unit          text,
  price_usd     numeric(10,2) NOT NULL,
  notes         text,
  in_stock      boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER price_list_updated_at
  BEFORE UPDATE ON price_list
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE price_list ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON price_list TO anon;
GRANT ALL    ON price_list TO authenticated;

CREATE POLICY "public_read_price_list"
  ON price_list FOR SELECT USING (true);

CREATE POLICY "admin_all_price_list"
  ON price_list FOR ALL TO authenticated USING (true) WITH CHECK (true);
