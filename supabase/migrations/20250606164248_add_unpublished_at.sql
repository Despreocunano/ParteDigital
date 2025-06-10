-- Add unpublished_at column to landing_pages table
ALTER TABLE landing_pages
  ADD COLUMN IF NOT EXISTS unpublished_at timestamptz;

-- Add comment
COMMENT ON COLUMN landing_pages.unpublished_at IS 'When the landing page was unpublished'; 