/*
  # Add Flowers template to landing_templates table
  
  1. Changes
    - Insert the new Flowers template with ID 550e8400-e29b-41d4-a716-446655440002
    - Set appropriate configuration and preview image
*/

-- Insert the Flowers template
INSERT INTO landing_templates (id, name, description, preview_image_url, configuration, is_active)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'Flowers',
    'Un diseño floral y natural con tonos cálidos y terrosos',
    'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg',
    '{"theme": "flowers", "colors": {"primary": "#8B4513", "secondary": "#FDF8F5", "accent": "#E8A87C", "highlight": "#CD853F"}}',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  preview_image_url = EXCLUDED.preview_image_url,
  configuration = EXCLUDED.configuration,
  is_active = EXCLUDED.is_active;