-- =====================================================
-- Skill Force Cloud - Supabase Database Schema
-- =====================================================
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. Contact Submissions Table
-- Stores all contact form submissions from the website
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  program TEXT NOT NULL,
  passout_year TEXT NOT NULL,
  resume_url TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for faster queries by date
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at 
ON contact_submissions(created_at DESC);

-- Index for searching by email
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
ON contact_submissions(email);

-- =====================================================

-- 2. Admin Users Table
-- Stores admin credentials for dashboard access
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE
);

-- =====================================================

-- 3. Enable Row Level Security (RLS)
-- This ensures data security at the database level
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- =====================================================

-- 4. RLS Policies for contact_submissions
-- Allow insertions from anyone (for contact form)
CREATE POLICY "Allow public insert" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can read
CREATE POLICY "Allow authenticated read" ON contact_submissions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- =====================================================

-- 5. RLS Policies for admin_users
-- Only authenticated users can read their own data
CREATE POLICY "Users can view own data" ON admin_users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- =====================================================

-- 6. Create a function to verify admin login
-- This will be used by the login API
CREATE OR REPLACE FUNCTION verify_admin_login(
  p_username TEXT,
  p_password_hash TEXT
)
RETURNS TABLE (
  id UUID,
  username TEXT,
  email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    admin_users.id,
    admin_users.username,
    admin_users.email
  FROM admin_users
  WHERE admin_users.username = p_username
    AND admin_users.password_hash = p_password_hash;
    
  -- Update last login time
  UPDATE admin_users 
  SET last_login = NOW()
  WHERE admin_users.username = p_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================

-- 7. Grant necessary permissions
-- These ensure the API can access the tables
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON contact_submissions TO anon, authenticated;
GRANT SELECT ON admin_users TO authenticated;
GRANT EXECUTE ON FUNCTION verify_admin_login TO anon, authenticated;

-- =====================================================
-- IMPORTANT: After running this SQL, you need to:
-- 1. Create your first admin user manually or via an API
-- 2. Add your Supabase credentials to .env
-- 3. Test the contact form submission
-- =====================================================
