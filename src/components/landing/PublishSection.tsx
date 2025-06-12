import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Globe, EyeOff, Copy, Check, Share2, Eye } from 'lucide-react';
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium">Vista Previa</h3>
              <p className="text-sm text-gray-500">
                Puedes ver cómo se verá tu invitación antes de publicarla
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => window.open(previewUrl, '_blank')}
                className="min-w-[120px] text-xs sm:text-sm"
                leftIcon={<Eye className="h-4 w-4" />}
              >
                Vista Previa
              </Button>
              {!publishedStatus.isPublished ? (
                <Button
                  type="button"
                  onClick={onPublish}
                  disabled={isPublishing}
                  className="min-w-[120px] text-xs sm:text-sm"
                  leftIcon={<Globe className="h-4 w-4" />}
                >
                  {isPublishing ? 'Publicando...' : 'Publicar'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={onUnpublish}
                  variant="secondary"
                  className="min-w-[120px] text-xs sm:text-sm"
                  leftIcon={<EyeOff className="h-4 w-4" />}
                >
                  Despublicar
                </Button>
              )}
            </div>
          </div>

          {publishedStatus.isPublished && publishedUrl && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">Compartir Invitación</h3>
                  <p className="text-sm text-gray-500">
                    Comparte el enlace de tu invitación con tus invitados
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleShare('whatsapp')}
                    className="min-w-[120px] text-xs sm:text-sm"
                    leftIcon={<Share2 className="h-4 w-4" />}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleShare('copy')}
                    className="min-w-[120px] text-xs sm:text-sm"
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