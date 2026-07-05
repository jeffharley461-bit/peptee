-- Migration 006: Storage buckets and policies
-- Run this in Supabase SQL Editor OR create buckets manually in Storage dashboard

-- Create buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('product-images',    'product-images',    true,  5242880,  ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('inquiry-documents', 'inquiry-documents', false, 10485760, ARRAY['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('company-logos',     'company-logos',     true,  2097152,  ARRAY['image/jpeg','image/png','image/webp','image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PRODUCT IMAGES (public bucket)
-- ============================================================
DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
CREATE POLICY "public_read_product_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "admin_upload_product_images" ON storage.objects;
CREATE POLICY "admin_upload_product_images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_update_product_images" ON storage.objects;
CREATE POLICY "admin_update_product_images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_delete_product_images" ON storage.objects;
CREATE POLICY "admin_delete_product_images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ============================================================
-- INQUIRY DOCUMENTS (private bucket)
-- ============================================================
DROP POLICY IF EXISTS "public_upload_inquiry_docs" ON storage.objects;
CREATE POLICY "public_upload_inquiry_docs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'inquiry-documents');

DROP POLICY IF EXISTS "admin_read_inquiry_docs" ON storage.objects;
CREATE POLICY "admin_read_inquiry_docs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'inquiry-documents' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_delete_inquiry_docs" ON storage.objects;
CREATE POLICY "admin_delete_inquiry_docs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'inquiry-documents' AND auth.role() = 'authenticated');

-- ============================================================
-- COMPANY LOGOS (public bucket, admin managed)
-- ============================================================
DROP POLICY IF EXISTS "public_read_logos" ON storage.objects;
CREATE POLICY "public_read_logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'company-logos');

DROP POLICY IF EXISTS "admin_manage_logos" ON storage.objects;
CREATE POLICY "admin_manage_logos"
  ON storage.objects FOR ALL
  USING (bucket_id = 'company-logos' AND auth.role() = 'authenticated');
