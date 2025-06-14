import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Globe, EyeOff, Copy, Check, Share2, Eye, Link2, QrCode, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';

const PUBLISH_PRICE = 100; // Precio de publicación en CLP

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
  hasRequiredInfo?: boolean;
}

export function PublishSection({
  previewUrl,
  publishedUrl,
  publishedStatus,
  isPublishing,
  onPublish,
  onUnpublish,
  hasRequiredInfo = true
}: PublishSectionProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [isCreatingPreference, setIsCreatingPreference] = useState(false);
  const [preferenceId, setPreferenceId] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Check if user has already paid
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('status')
          .eq('user_id', user.id)
          .eq('type', 'publish')
          .eq('status', 'approved')
          .maybeSingle();
        
        if (error) throw error;
        
        setHasPaid(!!data);
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };
    
    checkPaymentStatus();
  }, [user]);

  const handleCopy = async () => {
    if (!publishedUrl) return;

    try {
      await navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      toast.success('URL copiada al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Error al copiar la URL');
    }
  };

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

  const handlePublishClick = () => {
    if (hasPaid || publishedStatus.isPublished) {
      onPublish();
    } else {
      setShowPaymentModal(true);
    }
  };

  const createPaymentPreference = async () => {
    if (!user) return;
    
    setIsCreatingPreference(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: PUBLISH_PRICE,
          description: 'Publicación de invitación digital',
          paymentType: 'publish'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        window.location.href = data.init_point;
      } else {
        throw new Error(data.error || 'Error al crear la preferencia de pago');
      }
    } catch (error) {
      console.error('Error creating payment preference:', error);
      toast.error('Error al crear la preferencia de pago');
      setShowPaymentModal(false);
    } finally {
      setIsCreatingPreference(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {!hasRequiredInfo ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-rose-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-gray-900">Crea tu invitación digital</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Completa el formulario con la información requerida y podrás previsualizarla y compartirla con tus invitados en minutos. ¡Vamos a ello!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Vista Previa */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Vista Previa</h3>
                    <p className="text-sm text-gray-500">
                      Visualiza cómo se verá tu invitación
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => window.open(previewUrl, '_blank')}
                    className="w-full md:flex-1 border border-primary text-primary hover:bg-primary-dark hover:text-primary-contrast"
                    leftIcon={<Eye className="h-4 w-4" />}
                    disabled={!hasRequiredInfo}
                  >
                    Previsualizar
                  </Button>
                  {!publishedStatus.isPublished ? (
                    <Button
                      type="button"
                      onClick={handlePublishClick}
                      disabled={isPublishing || !hasRequiredInfo || isCreatingPreference}
                      className="flex-1 bg-primary hover:bg-primary-dark text-primary-contrast"
                      leftIcon={hasPaid ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      isLoading={isPublishing || isCreatingPreference}
                    >
                      {isPublishing ? 'Publicando...' : hasPaid ? 'Publicar' : `Publicar ($${PUBLISH_PRICE.toLocaleString('es-CL')})`}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={onUnpublish}
                      variant="secondary"
                      className="flex-1 border border-primary bg-primary hover:bg-primary-dark text-primary-contrast"
                      leftIcon={<EyeOff className="h-4 w-4" />}
                    >
                      Despublicar
                    </Button>
                  )}
                </div>
              </div>

              {/* Compartir */}
              {publishedStatus.isPublished && publishedUrl && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Compartir Invitación</h3>
                      <p className="text-sm text-gray-500">
                        Comparte el enlace con tus invitados
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Link2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 flex-1 truncate">{publishedUrl}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare('copy')}
                        className="shrink-0"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleShare('whatsapp')}
                        className="w-full md:flex-1 border border-primary text-primary hover:bg-primary-dark hover:text-primary-contrast text-sm"
                        leftIcon={<Share2 className="h-4 w-4" />}
                      >
                        WhatsApp
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowQR(!showQR)}
                        className="flex-1 border border-primary text-primary hover:bg-primary-dark hover:text-primary-contrast text-sm"
                        leftIcon={<QrCode className="h-4 w-4" />}
                      >
                        {showQR ? 'Ocultar QR' : 'Ver QR'}
                      </Button>
                    </div>

                    {showQR && (
                      <div className="p-4 bg-white rounded-lg border border-gray-100 text-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publishedUrl)}`}
                          alt="QR Code"
                          className="mx-auto"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Escanea este código para acceder a la invitación
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Publicar tu invitación"
      >
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <Globe className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Publicación de invitación</h3>
                <p className="text-sm text-gray-500">
                  Pago único para publicar tu invitación
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <span className="text-gray-700">Total a pagar:</span>
              <span className="text-xl font-semibold text-gray-900">${PUBLISH_PRICE.toLocaleString('es-CL')} CLP</span>
            </div>
          </div>

          <Button
            onClick={createPaymentPreference}
            className="w-full bg-primary hover:bg-primary-dark text-white"
            disabled={isCreatingPreference}
            isLoading={isCreatingPreference}
          >
            {isCreatingPreference ? 'Procesando...' : 'Pagar con MercadoPago'}
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Al completar el pago, tu invitación será publicada automáticamente y podrás compartirla con tus invitados.
          </p>
        </div>
      </Modal>
    </>
  );
}