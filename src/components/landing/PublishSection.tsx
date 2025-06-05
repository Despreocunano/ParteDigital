import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Globe, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PublishSectionProps {
  previewUrl: string;
  publishedUrl: string | null;
  publishedStatus: {
    isPublished: boolean;
    slug: string | null;
  };
  isPublishing: boolean;
  onPublish: () => void;
  onUnpublish: () => void;
}

export function PublishSection({
  previewUrl,
  publishedUrl,
  publishedStatus,
  isPublishing,
  onPublish,
  onUnpublish
}: PublishSectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Vista Previa</h3>
            <p className="text-sm text-gray-500 mt-1">
              Visualiza cómo se verá tu invitación
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Link
              to={previewUrl}
              target="_blank"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Vista Previa
            </Link>
            {publishedStatus.isPublished ? (
              <Button
                type="button"
                variant="outline"
                onClick={onUnpublish}
                leftIcon={<EyeOff className="h-4 w-4" />}
                className="w-full sm:w-auto justify-center"
              >
                Despublicar
              </Button>
            ) : (
              <Button
                type="button"
                onClick={onPublish}
                isLoading={isPublishing}
                leftIcon={<Globe className="h-4 w-4" />}
                className="w-full sm:w-auto justify-center"
              >
                Publicar
              </Button>
            )}
          </div>
        </div>
        {publishedStatus.isPublished && publishedUrl && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Tu página está publicada en:
            </p>
            <a 
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-sm font-medium text-rose-600 hover:text-rose-700 break-all"
            >
              {publishedUrl}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}