import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Globe, EyeOff, Copy, Check, Share2, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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
  const [copied, setCopied] = React.useState(false);

  const handleShare = async (platform: 'whatsapp' | 'instagram' | 'copy') => {
    if (!publishedUrl) return;

    const text = `¡Te invitamos a nuestra boda! 💍\n\nPuedes confirmar tu asistencia en:`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(publishedUrl);

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}%0A${encodedUrl}`, '_blank');
        break;
      case 'instagram':
        // For Instagram, we'll copy the text to clipboard since direct story sharing isn't possible
        try {
          await navigator.clipboard.writeText(`${text}\n\n${publishedUrl}`);
          toast.success('Texto copiado para compartir en Instagram');
        } catch (err) {
          toast.error('Error al copiar el texto');
        }
        window.open('https://instagram.com', '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(publishedUrl);
          setCopied(true);
          toast.success('URL copiada al portapapeles');
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          toast.error('Error al copiar la URL');
        }
        break;
    }
  };

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
                variant="secondary"
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
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 mb-2">
                Tu página está publicada en:
              </p>
                <a 
                  href={publishedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                className="text-sm font-medium text-rose-600 hover:text-rose-700 break-all block"
                >
                  {publishedUrl}
                </a>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Compartir invitación:
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleShare('whatsapp')}
                  leftIcon={<Share2 className="h-4 w-4" />}
                >
                  WhatsApp
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleShare('instagram')}
                  leftIcon={<Instagram className="h-4 w-4" />}
                >
                  Instagram
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleShare('copy')}
                  leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                >
                  {copied ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}