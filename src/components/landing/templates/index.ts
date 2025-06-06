import { DeluxeTemplate } from './deluxe';
import type { TemplateProps } from './types';

export const templates = {
  deluxe: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Deluxe',
    component: DeluxeTemplate,
    preview: 'https://images.pexels.com/photos/931796/pexels-photo-931796.jpeg',
    description: 'Un diseño lujoso y sofisticado con detalles dorados'
  }
};

export function getTemplate(templateId: string) {
  return templates.deluxe;
}

export type { TemplateProps };