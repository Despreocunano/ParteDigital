import { DeluxeTemplate } from './DeluxeTemplate';
import { RomanticTemplate } from './RomanticTemplate';

export interface TemplateProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  welcomeMessage?: string;
  ceremonyDate?: string;
  ceremonyTime?: string;
  ceremonyLocation?: string;
  ceremonyAddress?: string;
  partyDate?: string;
  partyTime?: string;
  partyLocation?: string;
  partyAddress?: string;
  musicEnabled?: boolean;
  onMusicToggle?: (enabled: boolean) => void;
  coverImage?: string;
  galleryImages?: string[];
}

export const templates = {
  deluxe: {
    id: 'deluxe',
    name: 'Deluxe',
    component: DeluxeTemplate,
    preview: 'https://images.pexels.com/photos/931796/pexels-photo-931796.jpeg',
    description: 'Un diseño lujoso y sofisticado con detalles dorados'
  },
  romantic: {
    id: 'romantic',
    name: 'Romántico',
    component: RomanticTemplate,
    preview: 'https://images.pexels.com/photos/1589820/pexels-photo-1589820.jpeg',
    description: 'Un diseño romántico y elegante con toques florales'
  }
};

export function getTemplate(templateId: string) {
  return templates[templateId as keyof typeof templates] || templates.deluxe;
}