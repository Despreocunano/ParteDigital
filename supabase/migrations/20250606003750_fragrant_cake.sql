/*
  # Add hashtag field to landing_pages table
  
  1. Changes
    - Add hashtag column to landing_pages table
    - Add function to generate default hashtag
*/

-- Add hashtag column
ALTER TABLE landing_pages
  ADD COLUMN IF NOT EXISTS hashtag text;

-- Create function to generate default hashtag
CREATE OR REPLACE FUNCTION generate_wedding_hashtag(groom_name text, bride_name text)
RETURNS text AS $$
BEGIN
  RETURN CONCAT(
    INITCAP(REGEXP_REPLACE(groom_name, '[^a-zA-Z0-9]', '', 'g')),
    'Y',
    INITCAP(REGEXP_REPLACE(bride_name, '[^a-zA-Z0-9]', '', 'g')),
    '2024'
  );
END;
$$ LANGUAGE plpgsql;

-- Update existing records with default hashtags
UPDATE landing_pages
SET hashtag = generate_wedding_hashtag(groom_name, bride_name)
WHERE hashtag IS NULL;

-- Add comment
COMMENT ON COLUMN landing_pages.hashtag IS 'Custom hashtag for the wedding';