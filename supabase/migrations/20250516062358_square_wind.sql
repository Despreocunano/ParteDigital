-- Add profile_image column to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS profile_image text;

COMMENT ON COLUMN users.profile_image IS 'URL of the profile image used in email signatures';