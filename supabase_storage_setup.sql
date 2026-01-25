-- =====================================================
-- Supabase Storage Bucket Setup
-- =====================================================
-- Run this in your Supabase SQL Editor AFTER creating the bucket
-- =====================================================

-- 1. Create a storage bucket called 'resumes' in Supabase Dashboard:
--    Storage > Create bucket > Name: resumes > Public: true

-- 2. Then run this SQL to set up policies:

-- Policy to allow public uploads
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'resumes');

-- Policy to allow public downloads
CREATE POLICY "Allow public downloads" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'resumes');

-- Policy to allow authenticated users to update
CREATE POLICY "Allow authenticated updates" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- Policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- =====================================================
-- IMPORTANT: Bucket Settings in Supabase Dashboard
-- =====================================================
-- 1. Go to Storage > resumes bucket > Settings
-- 2. Set "File size limit" to 5 MB (5242880 bytes)
-- 3. Set "Allowed MIME types" to: application/pdf
-- =====================================================
