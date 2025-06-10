import { DeluxeTemplate } from './deluxe';
import { FlowersTemplate } from './flowers';
import { TerraTemplate } from './terra';
import { CerezoTemplate } from './cerezo';
import type { TemplateProps } from './types';

export const templates = {
  deluxe: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Deluxe',
    component: DeluxeTemplate,
    preview: 'https://images.pexels.com/photos/931796/pexels-photo-931796.jpeg',
    description: 'Un diseño lujoso y sofisticado con detalles dorados'
  },
  flowers: {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Flowers',
    component: FlowersTemplate,
    preview: 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg',
    description: 'Un diseño floral y natural con tonos cálidos y terrosos'
  },
  terra: {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Terra',
    component: TerraTemplate,
    preview: 'https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg',
    description: 'Un diseño terroso y elegante con tonos tierra y dorados'
  },
  cerezo: {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Cerezo',
    component: CerezoTemplate,
    preview: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg',
    description: 'Un diseño romántico inspirado en los cerezos en flor con tonos rosados'
  }
};

// Map template IDs to template keys for lookup
const templateIdMap = {
  '550e8400-e29b-41d4-a716-446655440000': 'deluxe',
  '550e8400-e29b-41d4-a716-446655440002': 'flowers',
  '550e8400-e29b-41d4-a716-446655440003': 'terra',
  '550e8400-e29b-41d4-a716-446655440004': 'cerezo'
};

export function getTemplate(templateId: string) {
  // First try to find by ID
  const templateKey = templateIdMap[templateId as keyof typeof templateIdMap];
  if (templateKey) {
    return templates[templateKey as keyof typeof templates];
  }
  
  // Fallback: try to find by key (for backward compatibility)
  const templateByKey = templates[templateId as keyof typeof templates];
  if (templateByKey) {
    return templateByKey;
  }
  
  // Default fallback
  return templates.deluxe;
}

export type { TemplateProps };