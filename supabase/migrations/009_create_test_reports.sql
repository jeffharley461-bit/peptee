-- Migration 009: Test reports / Certificates of Analysis (COA)
-- Depends on: 002 (update_updated_at function)

CREATE TABLE IF NOT EXISTS test_reports (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name    text NOT NULL,
  batch_number    text,
  purity_percent  numeric(5,2) CHECK (purity_percent >= 0 AND purity_percent <= 100),
  method          text,
  tested_on       date,
  report_url      text,
  is_published    boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS test_reports_updated_at ON test_reports;
CREATE TRIGGER test_reports_updated_at
  BEFORE UPDATE ON test_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_test_reports_product    ON test_reports (product_id);
CREATE INDEX IF NOT EXISTS idx_test_reports_created_at ON test_reports (created_at DESC);

-- Row Level Security: public read published reports, admin full access
ALTER TABLE test_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_test_reports" ON test_reports;
CREATE POLICY "public_read_test_reports"
  ON test_reports FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "admin_all_test_reports" ON test_reports;
CREATE POLICY "admin_all_test_reports"
  ON test_reports FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE: public bucket for COA / test report PDFs
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('test-reports', 'test-reports', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_test_reports_files" ON storage.objects;
CREATE POLICY "public_read_test_reports_files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'test-reports');

DROP POLICY IF EXISTS "admin_upload_test_reports_files" ON storage.objects;
CREATE POLICY "admin_upload_test_reports_files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'test-reports' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_update_test_reports_files" ON storage.objects;
CREATE POLICY "admin_update_test_reports_files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'test-reports' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_delete_test_reports_files" ON storage.objects;
CREATE POLICY "admin_delete_test_reports_files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'test-reports' AND auth.role() = 'authenticated');
