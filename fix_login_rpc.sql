-- =====================================================
-- Fix Admin Login (RLS Bypass)
-- =====================================================
-- The previous login failed because RLS prevents reading admin data.
-- This function allows the login API to securely fetch the password hash.
-- =====================================================

CREATE OR REPLACE FUNCTION get_admin_for_login(p_username TEXT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  password_hash TEXT,
  email TEXT
) 
SECURITY DEFINER -- Runs with superuser privileges to bypass RLS
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    admin_users.id,
    admin_users.username,
    admin_users.password_hash,
    admin_users.email
  FROM admin_users
  WHERE admin_users.username = p_username;
END;
$$ LANGUAGE plpgsql;

-- Grant access to the API
GRANT EXECUTE ON FUNCTION get_admin_for_login(TEXT) TO anon, authenticated;

-- =====================================================
-- Run this in Supabase SQL Editor
-- =====================================================
