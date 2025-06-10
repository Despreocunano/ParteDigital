-- Insert the Terra template
INSERT INTO landing_templates (id, name, description, preview_image_url, configuration, is_active)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'Terra',
    'Un diseño terroso y elegante con tonos tierra y dorados',
    'https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg',
    '{"theme": "terra", "colors": {"primary": "#47261F", "secondary": "#5C3229", "accent": "#46261F", "highlight": "#FAB765", "gold": "#DF9434"}}',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  preview_image_url = EXCLUDED.preview_image_url,
  configuration = EXCLUDED.configuration,
  is_active = EXCLUDED.is_active;