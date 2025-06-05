export interface TemplateProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  welcomeMessage?: string;
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
}