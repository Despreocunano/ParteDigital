import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Globe, EyeOff, Copy, Check, Share2 } from 'lucide-react';
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

  const handleShare = async (platform: 'whatsapp' | 'copy') => {
    if (!publishedUrl) return;

    const text = `¡Te invitamos a nuestra boda! 💍\n\nPuedes confirmar tu asistencia en:`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(publishedUrl);

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}%0A${encodedUrl}`, '_blank');
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
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Vista Previa</h3>
              <p className="text-sm text-gray-500">
                Puedes ver cómo se verá tu invitación antes de publicarla
              </p>
            </div>
            <Link
              to={previewUrl}
              target="_blank"
              className="text-sm font-medium text-rose-600 hover:text-rose-700"
            >
              Ver vista previa
            </Link>
          </div>

          {!publishedStatus.isPublished ? (
            <Button
              onClick={onPublish}
              disabled={isPublishing}
              className="w-full"
              leftIcon={<Globe className="h-4 w-4" />}
            >
              {isPublishing ? 'Publicando...' : 'Publicar Invitación'}
            </Button>
          ) : (
            <Button
              onClick={onUnpublish}
              variant="secondary"
              className="w-full"
              leftIcon={<EyeOff className="h-4 w-4" />}
            >
              Despublicar Invitación
            </Button>
          )}

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
                    onClick={() => handleShare('copy')}
                    leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  >
                    {copied ? 'Copiado' : 'Copiar'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}