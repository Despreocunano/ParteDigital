import { DeluxePetroTemplate } from './deluxe_petro';
import { DeluxeTerraTemplate } from './deluxe_terra';
import { DeluxeJadeTemplate } from './deluxe_jade';
import { FlowersTemplate } from './flowers';
import { CerezoTemplate } from './cerezo';
import { EsmeraldaTemplate } from './esmeralda';
import { BurdeosTemplate } from './burdeos';
import { MinimalistaTemplate } from './minimalista';
import { BlackRoseTemplate } from './black_rose';
import type { TemplateProps, Template, TemplateVariantGroup } from './types';

// Color variants for templates that are identical except for colors
export const templateVariants: Record<string, TemplateVariantGroup> = {
  deluxe: {
    baseId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Deluxe',
    variants: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Petro',
        color: 'petro',
        colorValue: '#253238',
        component: DeluxePetroTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749836790/deluxe_ixlksa.png'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Terra',
        color: 'terra',
        colorValue: '#5B3229',
        component: DeluxeTerraTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749841323/terra_y14f9j.png'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440008',
        name: 'Jade',
        color: 'jade',
        colorValue: '#254636',
        component: DeluxeJadeTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750228168/jade_ed85lx.png'
      }
    ]
  }
};

export const templates: Record<string, Template> = {
  deluxe_petro: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Deluxe Petro',
    component: DeluxePetroTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749836790/deluxe_ixlksa.png',
    hasVariants: true,
    variantGroup: 'deluxe'
  },
  deluxe_terra: {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Deluxe Terra',
    component: DeluxeTerraTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749841323/terra_y14f9j.png',
    hasVariants: true,
    variantGroup: 'deluxe'
  },
  deluxe_jade: {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'Deluxe Jade',
    component: DeluxeJadeTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750228168/jade_ed85lx.png',
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
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750228351/flowers_x8glz3.png'
  },
  cerezo: {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Cerezo',
    component: CerezoTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750228019/cerezo_2_vxfrn6.png'
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
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750228541/minimalista_01_qheez7.png'
  },
  black_rose: {
    id: '550e8400-e29b-41d4-a716-446655440009',
    name: 'Black Rose',
    component: BlackRoseTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750299549/blackrose_nhvdaq.png'
  }
};

// Map template IDs to template keys for lookup
const templateIdMap: Record<string, string> = {
  '550e8400-e29b-41d4-a716-446655440000': 'deluxe_petro',
  '550e8400-e29b-41d4-a716-446655440002': 'flowers',
  '550e8400-e29b-41d4-a716-446655440003': 'deluxe_terra',
  '550e8400-e29b-41d4-a716-446655440004': 'cerezo',
  '550e8400-e29b-41d4-a716-446655440005': 'esmeralda',
  '550e8400-e29b-41d4-a716-446655440006': 'burdeos',
  '550e8400-e29b-41d4-a716-446655440007': 'minimalista',
  '550e8400-e29b-41d4-a716-446655440008': 'deluxe_jade',
  '550e8400-e29b-41d4-a716-446655440009': 'black_rose'
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