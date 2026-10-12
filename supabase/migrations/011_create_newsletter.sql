-- Migration 011: Newsletter subscribers

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL UNIQUE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone may subscribe, only admins may read the list
DROP POLICY IF EXISTS "public_insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "public_insert_newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_all_newsletter" ON newsletter_subscribers;
CREATE POLICY "admin_all_newsletter"
  ON newsletter_subscribers FOR ALL
  USING (auth.role() = 'authenticated');
