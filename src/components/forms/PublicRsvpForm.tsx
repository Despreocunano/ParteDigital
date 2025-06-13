import { EmbeddableRsvpForm } from './EmbeddableRsvpForm';

interface PublicRsvpFormProps {
  userId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  showSongRecommendations?: boolean;
  theme?: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    inputBackground: string;
    placeholderColor: string;
    accentColor: string;
    successBackground: string;
    successText: string;
    errorBackground: string;
    errorText: string;
  };
}

export function PublicRsvpForm(props: PublicRsvpFormProps) {
  return <EmbeddableRsvpForm {...props} />;
}