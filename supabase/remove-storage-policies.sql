-- Remove Supabase Storage Policies and Bucket
-- Run this in Supabase SQL Editor to clean up storage-related configurations
-- NOTE: This is optional - only run if you want to completely remove Supabase storage

-- ============================================================================
-- DROP STORAGE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can upload their own bills" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own bills" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own bills" ON storage.objects;

-- ============================================================================
-- REMOVE STORAGE BUCKET (OPTIONAL)
-- ============================================================================

-- WARNING: This will delete all files in the bucket!
-- Only uncomment and run if you're sure you want to delete all files

-- DELETE FROM storage.buckets WHERE id = 'bills';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check that policies are removed
-- SELECT * FROM pg_policies WHERE schemaname = 'storage';

-- Check that bucket still exists (if you didn't delete it)
-- SELECT * FROM storage.buckets WHERE id = 'bills';
