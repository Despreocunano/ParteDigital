/*
  # Update users table schema
  
  1. Changes
    - Replace wedding_name with separate groom_name and bride_name columns
    - Handle existing data migration
    - Set default values and constraints
*/

-- First, add the new columns without NOT NULL constraint
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS groom_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS bride_name text DEFAULT '';

-- Copy wedding_name to groom_name for existing records
UPDATE users
SET groom_name = COALESCE(wedding_name, '')
WHERE groom_name IS NULL;

-- Set empty string for any remaining null bride_name values
UPDATE users
SET bride_name = ''
WHERE bride_name IS NULL;

-- Drop the wedding_name column
ALTER TABLE users
  DROP COLUMN IF EXISTS wedding_name;

-- Now that we've handled null values, make the columns required
ALTER TABLE users
  ALTER COLUMN groom_name SET NOT NULL,
  ALTER COLUMN bride_name SET NOT NULL;