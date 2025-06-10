-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage templates" ON landing_templates;
DROP POLICY IF EXISTS "Users can view active templates" ON landing_templates;

-- Create landing templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS landing_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  preview_image_url text,
  configuration jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Add comment
COMMENT ON TABLE landing_templates IS 'Stores landing page template configurations';

-- Enable RLS
ALTER TABLE landing_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage templates" ON landing_templates
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "Users can view active templates" ON landing_templates
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Insert default templates
INSERT INTO landing_templates (id, name, description, preview_image_url, configuration, is_active)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'Deluxe',
    'Un diseño lujoso y sofisticado con detalles dorados',
    'https://images.pexels.com/photos/931796/pexels-photo-931796.jpeg',
    '{"theme": "deluxe", "colors": {"primary": "#D4B572", "secondary": "#1C2127", "accent": "#9B774D", "highlight": "#E5C992"}}',
    true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'Terra',
    'Un diseño elegante con tonos terrosos y cálidos',
    'https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg',
    '{"theme": "terra", "colors": {"primary": "#5C3229", "secondary": "#46261F", "accent": "#DF9434", "highlight": "#FAB764"}}',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  preview_image_url = EXCLUDED.preview_image_url,
  configuration = EXCLUDED.configuration,
  is_active = EXCLUDED.is_active;