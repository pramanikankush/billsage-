-- Fix RLS Policies for Firebase Authentication
-- Run this in Supabase SQL Editor to fix "Error creating user" issue

-- ============================================================================
-- UPDATE RLS POLICIES FOR FIREBASE AUTH COMPATIBILITY
-- ============================================================================

-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Anyone can insert users (for signup)" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Create more permissive policies that work with Firebase Auth
-- These allow the application to manage users via the Supabase anon key

CREATE POLICY "Allow user creation from application"
    ON users FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow reading user profiles"
    ON users FOR SELECT
    USING (true);

CREATE POLICY "Allow updating user profiles"
    ON users FOR UPDATE
    USING (true);

-- Note: For production, consider using Supabase Service Role Key
-- for database operations instead of making policies fully permissive
