/*
  # Add additional info fields to landing pages
  
  1. Changes
    - Add dress_code column
    - Add additional_info column
    - Set default values
*/

-- Add new columns
ALTER TABLE landing_pages
  ADD COLUMN IF NOT EXISTS dress_code text DEFAULT 'Formal',
  ADD COLUMN IF NOT EXISTS additional_info text DEFAULT 'La celebración será al aire libre';

-- Add comments
COMMENT ON COLUMN landing_pages.dress_code IS 'Dress code for the wedding';
COMMENT ON COLUMN landing_pages.additional_info IS 'Additional information and tips for guests';