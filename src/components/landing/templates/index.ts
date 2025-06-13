import { DeluxeTemplate } from './deluxe';
import { FlowersTemplate } from './flowers';
import { TerraTemplate } from './terra';
import { CerezoTemplate } from './cerezo';
import { EsmeraldaTemplate } from './esmeralda';
import type { TemplateProps } from './types';

export const templates = {
  deluxe: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Deluxe',
    component: DeluxeTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749836790/deluxe_ixlksa.png',
    description: 'Un diseño lujoso y sofisticado con detalles dorados'
  },
  esmeralda: {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Esmeralda',
    component: EsmeraldaTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749837919/esmeralda_pn3bwa.png',
    description: 'Un diseño romántico inspirado en los cerezos en flor con tonos rosados'
  },
  flowers: {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Flowers',
    component: FlowersTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749837920/cerezo_vni4m5.png',
    description: 'Un diseño floral y natural con tonos cálidos y terrosos'
  },
  terra: {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Terra',
    component: TerraTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749837920/cerezo_vni4m5.png',
    description: 'Un diseño terroso y elegante con tonos tierra y dorados'
  },
  cerezo: {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Cerezo',
    component: CerezoTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749837920/cerezo_vni4m5.png',
    description: 'Un diseño romántico inspirado en los cerezos en flor con tonos rosados'
  }
};

// Map template IDs to template keys for lookup
const templateIdMap = {
  '550e8400-e29b-41d4-a716-446655440000': 'deluxe',
  '550e8400-e29b-41d4-a716-446655440002': 'flowers',
  '550e8400-e29b-41d4-a716-446655440003': 'terra',
  '550e8400-e29b-41d4-a716-446655440004': 'cerezo',
  '550e8400-e29b-41d4-a716-446655440005': 'esmeralda'
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