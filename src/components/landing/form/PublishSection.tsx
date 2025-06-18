import { CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { PublishSection as PublishSectionComponent } from '../PublishSection';
import { UseFormWatch } from 'react-hook-form';
import { LandingPageFormData } from '../../../types/landing';

interface PublishSectionProps {
  watch: UseFormWatch<LandingPageFormData>;
  publishedUrl: string | null;
  onPublish: () => void;
  onUnpublish: () => void;
  isPublishing: boolean;
  isPublished: boolean;
}

export function PublishSection({ 
  watch, 
  publishedUrl, 
  onPublish, 
  onUnpublish, 
  isPublishing, 
  isPublished 
}: PublishSectionProps) {
  const groomName = watch('groom_name');
  const brideName = watch('bride_name');

  // Construct preview URL based on names
  const previewUrl = `/preview/${groomName}-${brideName}`;

  return (
    <div className="bg-white rounded-lg border p-6">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="text-rose-600 font-medium">11</span>
          </div>
          <CardTitle>Publicar</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <PublishSectionComponent
          previewUrl={previewUrl}
          publishedUrl={publishedUrl}
          publishedStatus={{
            isPublished,
            slug: publishedUrl ? new URL(publishedUrl).pathname.slice(1) : null
          }}
          isPublishing={isPublishing}
          onPublish={onPublish}
          onUnpublish={onUnpublish}
          hasRequiredInfo={!!groomName && !!brideName}
        />
      </CardContent>
    </div>
  );
} 