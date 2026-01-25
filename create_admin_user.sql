-- =====================================================
-- Create First Admin User
-- =====================================================
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Insert admin user with hashed password
-- Username: skillforcecloudadmin
-- Password: SkillForce2026
INSERT INTO admin_users (username, email, password_hash)
VALUES (
  'skillforcecloudadmin',
  'admin@skillforcecloud.com',
  '$2b$10$QAvRxQEhWT6b.lPmudwqBOFK5sopOOYFa1sLN415Amzk6RLDI1KTq'
);

-- =====================================================
-- After running this SQL, you can login at:
-- URL: http://localhost:4321/admin/login
-- Username: skillforcecloudadmin  
-- Password: SkillForce2026
-- =====================================================
