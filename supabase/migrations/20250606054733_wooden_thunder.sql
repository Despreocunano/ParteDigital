```sql
-- Add template_config column to landing_pages table
ALTER TABLE landing_pages
  ADD COLUMN IF NOT EXISTS template_config jsonb;

-- Copy template configuration from landing_templates to existing landing pages
UPDATE landing_pages lp
SET template_config = lt.configuration
FROM landing_templates lt
WHERE lp.template_id = lt.id
  AND lp.template_config IS NULL;

-- Add comment
COMMENT ON COLUMN landing_pages.template_config IS 'Template configuration including colors and theme settings';
```