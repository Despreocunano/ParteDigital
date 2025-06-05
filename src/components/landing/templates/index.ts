import { DeluxeTemplate } from './deluxe';
import { RomanticTemplate } from './romantic';
import { FlowersTemplate } from './flowers';
import type { TemplateProps } from './types';

export const templates = {
  deluxe: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Deluxe',
    component: DeluxeTemplate,
    preview: 'https://images.pexels.com/photos/931796/pexels-photo-931796.jpeg',
    description: 'Un diseño lujoso y sofisticado con detalles dorados'
  },
  romantic: {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    name: 'Romántico',
    component: RomanticTemplate,
    preview: 'https://images.pexels.com/photos/1589820/pexels-photo-1589820.jpeg',
    description: 'Un diseño romántico y elegante con toques florales'
  },
  flowers: {
    id: '7ba7b810-9dad-11d1-80b4-00c04fd430c9',
    name: 'Flores',
    component: FlowersTemplate,
    preview: 'https://images.pexels.com/photos/931158/pexels-photo-931158.jpeg',
    description: 'Un diseño delicado con motivos florales y tonos rosados'
  }
};

export function getTemplate(templateId: string) {
  const template = Object.values(templates).find(t => t.id === templateId);
  return template || templates.deluxe;
}

export type { TemplateProps };