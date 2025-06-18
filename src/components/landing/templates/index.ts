import { DeluxeTemplate } from './deluxe';
import { FlowersTemplate } from './flowers';
import { TerraTemplate } from './terra';
import { CerezoTemplate } from './cerezo';
import { EsmeraldaTemplate } from './esmeralda';
import { BurdeosTemplate } from './burdeos';
import { MinimalistaTemplate } from './minimalista';
import type { TemplateProps, Template, TemplateVariantGroup } from './types';

// Color variants for templates that are identical except for colors
export const templateVariants: Record<string, TemplateVariantGroup> = {
  deluxe: {
    baseId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Deluxe',
    variants: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Deluxe',
        color: 'deluxe',
        colorValue: '#253238',
        component: DeluxeTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749836790/deluxe_ixlksa.png'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Terra',
        color: 'terra',
        colorValue: '#5B3229',
        component: TerraTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749841323/terra_y14f9j.png'
      }
    ]
  }
};

export const templates: Record<string, Template> = {
  deluxe: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Deluxe',
    component: DeluxeTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749836790/deluxe_ixlksa.png',
    hasVariants: true,
    variantGroup: 'deluxe'
  },
  terra: {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Terra',
    component: TerraTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749841323/terra_y14f9j.png',
    hasVariants: true,
    variantGroup: 'deluxe'
  },
  esmeralda: {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Esmeralda',
    component: EsmeraldaTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749837919/esmeralda_pn3bwa.png'
  },
  flowers: {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Flowers',
    component: FlowersTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749841323/flowers_w4swj1.png'
  },
  cerezo: {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Cerezo',
    component: CerezoTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749837920/cerezo_vni4m5.png'
  },
  burdeos: {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Burdeos',
    component: BurdeosTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750127535/burdeos_eckqzg.png'
  },
  minimalista: {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Minimalista',
    component: MinimalistaTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750135663/minimalista_ykwwf7.png'
  }
};

// Map template IDs to template keys for lookup
const templateIdMap: Record<string, string> = {
  '550e8400-e29b-41d4-a716-446655440000': 'deluxe',
  '550e8400-e29b-41d4-a716-446655440002': 'flowers',
  '550e8400-e29b-41d4-a716-446655440003': 'terra',
  '550e8400-e29b-41d4-a716-446655440004': 'cerezo',
  '550e8400-e29b-41d4-a716-446655440005': 'esmeralda',
  '550e8400-e29b-41d4-a716-446655440006': 'burdeos',
  '550e8400-e29b-41d4-a716-446655440007': 'minimalista'
};

export function getTemplate(templateId: string): Template | null {
  // First try to find by ID
  const templateKey = templateIdMap[templateId];
  if (templateKey) {
    return templates[templateKey];
  }
  
  // If not found, return null
  return null;
}

// Get unique templates for display (grouping variants)
export function getUniqueTemplates(): (Template | TemplateVariantGroup)[] {
  const uniqueTemplates: (Template | TemplateVariantGroup)[] = [];
  const processedGroups = new Set<string>();

  Object.values(templates).forEach((template) => {
    if (template.hasVariants && template.variantGroup) {
      if (!processedGroups.has(template.variantGroup)) {
        const variantGroup = templateVariants[template.variantGroup];
        if (variantGroup) {
          uniqueTemplates.push({
            ...variantGroup,
            isVariantGroup: true
          });
          processedGroups.add(template.variantGroup);
        }
      }
    } else if (!template.hasVariants) {
      uniqueTemplates.push(template);
    }
  });

  return uniqueTemplates;
}

export type { TemplateProps };