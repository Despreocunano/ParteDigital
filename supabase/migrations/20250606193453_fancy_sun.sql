/*
  # Add Cerezo template to landing_templates table
  
  1. Changes
    - Insert the new Cerezo template with ID 550e8400-e29b-41d4-a716-446655440004
    - Set appropriate configuration and preview image
*/

-- Insert the Cerezo template
INSERT INTO landing_templates (id, name, description, preview_image_url, configuration, is_active)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440004',
    'Cerezo',
    'Un diseño romántico inspirado en los cerezos en flor con tonos rosados',
    'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg',
    '{"theme": "cerezo", "colors": {"primary": "#2D1B69", "secondary": "#FCE4EC", "accent": "#E91E63", "highlight": "#F8BBD9", "tertiary": "#8D6E63"}}',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  preview_image_url = EXCLUDED.preview_image_url,
  configuration = EXCLUDED.configuration,
  is_active = EXCLUDED.is_active;