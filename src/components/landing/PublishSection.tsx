import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { TicketPlus, Globe, EyeOff, Copy, Check, Share2, Eye, Link2, QrCode, CreditCard, Clock, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createPayment, checkPaymentStatus } from '../../lib/payment';
import { Modal } from '../ui/Modal';
import { trackBeginCheckout, trackPurchase } from '../../lib/analytics';

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
  const [copied, setCopied] = React.useState(false);
  const [showQR, setShowQR] = React.useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [paymentStatus, setPaymentStatus] = React.useState<string | null>(null);
  const [preferenceId, setPreferenceId] = React.useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = React.useState<string | null>(null);
  const [hasAlreadyPaid, setHasAlreadyPaid] = React.useState<boolean>(false);

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

  const handleStartPayment = async () => {
    if (!hasRequiredInfo) {
      toast.error('Por favor completa la información requerida antes de publicar');
      return;
    }

    setIsProcessingPayment(true);
    try {
      const result = await createPayment();
      if (result.success) {
        if (result.alreadyPaid) {
          setHasAlreadyPaid(true);
          toast.success('Ya tienes un pago aprobado. Tu invitación será publicada.');
          onPublish(); // Trigger the publish action
          return;
        }
        
        // Track begin checkout event
        trackBeginCheckout();
        
        setPreferenceId(result.preferenceId);
        setPaymentUrl(result.initPoint);
        setShowPaymentModal(true);
      } else if (result.alreadyPublished) {
        toast.success('Tu invitación ya está publicada');
        // Refresh the page to show the published status
        window.location.reload();
      } else {
        toast.error(result.error || 'Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error starting payment:', error);
      toast.error('Error al iniciar el proceso de pago');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const checkStatus = async () => {
    if (!preferenceId) return;
    
    console.log('🔍 Checking payment status for:', preferenceId);
    
    try {
      setPaymentStatus('checking');
      const result = await checkPaymentStatus(preferenceId);
      
      console.log('📊 Payment status result:', result);
      
      if (result.success) {
        if (result.landingPage.isPublished) {
          console.log('🎉 Payment successful! Landing page is published');
          // Track successful purchase
          trackPurchase(preferenceId);
          
          setPaymentStatus('success');
          setHasAlreadyPaid(true);
          toast.success('¡Pago completado! Tu invitación ha sido publicada');
          // Close modal and reload page after a short delay
          setTimeout(() => {
            setShowPaymentModal(false);
            window.location.reload();
          }, 1500);
        } else if (result.payment.status === 'approved') {
          console.log('✅ Payment approved, processing publication...');
          setPaymentStatus('processing');
          setHasAlreadyPaid(true);
          toast.success('Pago aprobado, publicando invitación...');
          // Trigger the publish action
          onPublish();
          // Check again in 3 seconds
          setTimeout(checkStatus, 3000);
        } else if (result.payment.status === 'pending') {
          console.log('⏳ Payment pending...');
          setPaymentStatus('pending');
          toast('Pago pendiente de confirmación', {
            icon: '⏳',
          });
        } else {
          console.log('❌ Payment failed or not completed');
          setPaymentStatus('failed');
          toast.error('El pago no fue completado');
        }
      } else {
        console.log('❌ Payment status check failed:', result.error);
        setPaymentStatus('failed');
        toast.error(result.error || 'Error al verificar el estado del pago');
      }
    } catch (error) {
      console.error('💥 Error checking payment status:', error);
      setPaymentStatus('failed');
      toast.error('Error al verificar el estado del pago');
    }
  };

  // Check if user has already paid when component mounts
  React.useEffect(() => {
    const checkPaymentHistory = async () => {
      try {
        const result = await createPayment();
        if (result.success && result.alreadyPaid) {
          setHasAlreadyPaid(true);
        }
      } catch (error) {
        console.error('Error checking payment history:', error);
      }
    };
    
    checkPaymentHistory();
  }, []);

  // Handle payment modal and automatic status checking
  React.useEffect(() => {
    if (showPaymentModal && preferenceId) {
      // Set up interval to check payment status every 5 seconds
      const interval = setInterval(() => {
        checkStatus();
      }, 5000);
      
      // Listen for window focus events (when user returns from Mercado Pago)
      const handleFocus = () => {
        if (showPaymentModal && preferenceId) {
          // Check status immediately when user returns
          checkStatus();
        }
      };

      window.addEventListener('focus', handleFocus);

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [showPaymentModal, preferenceId]);

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {!hasRequiredInfo ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
                <TicketPlus className="w-8 h-8 text-rose-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-gray-900">Crea tu invitación digital</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                Completa el formulario para crear y previsualizar tu invitación. ¿Te gustó el resultado? Publícala y compártela fácilmente con tus invitados.
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
                      onClick={handleStartPayment}
                      disabled={isProcessingPayment || !hasRequiredInfo}
                      className="flex-1 bg-primary hover:bg-primary-dark text-primary-contrast"
                      leftIcon={hasAlreadyPaid ? <Globe className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                    >
                      {isProcessingPayment ? 'Procesando...' : hasAlreadyPaid ? 'Publicar' : 'Publicar ($39.990)'}
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
        title="Publicar Invitación"
      >
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Publicación de invitación</span>
              <span className="text-gray-900 font-bold">$990</span>
            </div>
            <p className="text-sm text-gray-500">
              Pago único para publicar tu invitación digital y compartirla con tus invitados.
            </p>
          </div>

          {paymentStatus === null && (
            <>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Para publicar tu invitación, completa el pago a través de MercadoPago:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Pago único (no hay cargos recurrentes)</li>
                  <li>Pago seguro a través de MercadoPago</li>
                  <li>Puedes pagar con tarjeta de crédito, débito o saldo en MercadoPago</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => {
                    if (paymentUrl) {
                      window.open(paymentUrl, '_blank');
                    }
                  }}
                  className="bg-[#009ee3] hover:bg-[#008dcb] text-white"
                  disabled={!paymentUrl}
                >
                  Pagar con MercadoPago
                </Button>
                <Button
                  variant="secondary"
                  onClick={checkStatus}
                  disabled={!preferenceId}
                >
                  Ya realicé el pago
                </Button>
              </div>
            </>
          )}

          {paymentStatus === 'checking' && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Verificando el estado del pago...</p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">¡Pago completado!</h3>
              <p className="text-gray-600 mb-4">
                Tu invitación ha sido publicada correctamente.
              </p>
              <Button
                onClick={() => {
                  setShowPaymentModal(false);
                  window.location.reload();
                }}
              >
                Continuar
              </Button>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-600 mx-auto mb-4"></div>
              <p className="text-gray-700">
                Pago aprobado, estamos publicando tu invitación...
              </p>
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Pago pendiente</h3>
              <p className="text-gray-600 mb-4">
                Tu pago está siendo procesado. Una vez confirmado, tu invitación será publicada automáticamente.
              </p>
              <Button
                onClick={() => {
                  setShowPaymentModal(false);
                }}
              >
                Entendido
              </Button>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Pago no completado</h3>
              <p className="text-gray-600 mb-4">
                Hubo un problema con tu pago. Por favor intenta nuevamente.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setPaymentStatus(null);
                  }}
                >
                  Volver
                </Button>
                <Button
                  onClick={() => {
                    if (paymentUrl) {
                      window.open(paymentUrl, '_blank');
                    }
                  }}
                  className="bg-[#009ee3] hover:bg-[#008dcb] text-white"
                  disabled={!paymentUrl}
                >
                  Reintentar pago
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}