-- =====================================================
-- Update Admin Password to Plain Text
-- =====================================================
-- Run this in your Supabase SQL Editor to switch to plain text password
-- =====================================================

UPDATE admin_users 
SET password_hash = 'SkillForce2026' 
WHERE username = 'skillforcecloudadmin';

-- If the user doesn't exist, insert it with plain text password
INSERT INTO admin_users (username, email, password_hash)
SELECT 'skillforcecloudadmin', 'admin@skillforcecloud.com', 'SkillForce2026'
WHERE NOT EXISTS (
    SELECT 1 FROM admin_users WHERE username = 'skillforcecloudadmin'
);
