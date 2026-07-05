-- Migration 003: Create inquiries table

CREATE TABLE IF NOT EXISTS inquiries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      uuid REFERENCES products(id) ON DELETE SET NULL,
  customer_name   text NOT NULL,
  email           text NOT NULL,
  phone           text,
  whatsapp_number text,
  project_details text,
  document_url    text,
  status          text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','responded','completed','archived')),
  admin_notes     text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  responded_at    timestamptz
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_inquiries_status     ON inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email      ON inquiries (email);
