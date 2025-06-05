/*
  # Add trigger to sync names between users and landing_pages

  1. Changes
    - Create trigger function to sync names
    - Add trigger on users table
    - Update existing landing pages with current names
*/

-- Create trigger function
CREATE OR REPLACE FUNCTION sync_names_to_landing_pages()
RETURNS TRIGGER AS $$
BEGIN
  -- Update landing page if it exists
  UPDATE landing_pages
  SET 
    groom_name = NEW.groom_name,
    bride_name = NEW.bride_name,
    updated_at = now()
  WHERE user_id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS sync_names_trigger ON users;
CREATE TRIGGER sync_names_trigger
  AFTER UPDATE OF groom_name, bride_name
  ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_names_to_landing_pages();

-- Update existing landing pages with current names
UPDATE landing_pages lp
SET 
  groom_name = u.groom_name,
  bride_name = u.bride_name,
  updated_at = now()
FROM users u
WHERE lp.user_id = u.id;

COMMENT ON FUNCTION sync_names_to_landing_pages() IS 'Syncs groom and bride names from users table to landing_pages table';