export interface TemplateProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  welcomeMessage?: string;
  hashtag?: string;
  ceremonyDate?: string;
  ceremonyTime?: string;
  ceremonyLocation?: string;
  ceremonyAddress?: string;
  ceremonyPlaceId?: string;
  partyDate?: string;
  partyTime?: string;
  partyLocation?: string;
  partyAddress?: string;
  partyPlaceId?: string;
  musicEnabled?: boolean;
  musicUrl?: string;
  onMusicToggle?: (enabled: boolean) => void;
  coverImage?: string;
  galleryImages?: string[];
  userId: string;
  bankInfo?: {
    accountHolder: string;
    rut: string;
    bank: string;
    accountType: string;
    accountNumber: string;
    email: string;
  };
  dress_code: string;
  additional_info: string;
  accepts_kids: boolean;
  accepts_pets: boolean;
  couple_code: string;
  store?: string;
}

export interface TemplateVariant {
  id: string;
  name: string;
  color: string;
  colorValue: string;
  component: React.ComponentType<TemplateProps>;
  preview: string;
}

export interface TemplateVariantGroup {
  baseId: string;
  name: string;
  variants: TemplateVariant[];
  isVariantGroup?: boolean;
}

export interface Template {
  id: string;
  name: string;
  component: React.ComponentType<TemplateProps>;
  preview: string;
  hasVariants?: boolean;
  variantGroup?: string;
}