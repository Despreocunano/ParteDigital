import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        const paymentId = searchParams.get('payment_id');
        const preferenceId = searchParams.get('preference_id');
        const status = searchParams.get('status');

        if (!paymentId || !preferenceId) {
          throw new Error('Invalid payment response');
        }

        // Get the session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No authenticated session');
        }

        // Publish the landing page
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/publish-landing`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            paymentId,
            preferenceId
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error en la respuesta del API: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setPublishedUrl(data.data?.url || null);
          toast.success('¡Página publicada correctamente!');
          
          // Update local storage with published status
          localStorage.setItem('landing_page_status', JSON.stringify({
            isPublished: true,
            slug: data.data?.slug || null
          }));
          
          // Redirect to the landing page after 3 seconds
          setTimeout(() => {
            navigate('/landing');
          }, 3000);
        } else {
          throw new Error(data.error || 'Error al publicar la página');
        }
      } catch (error) {
        console.error('Error handling payment success:', error);
        toast.error(error instanceof Error ? error.message : 'Error al procesar el pago');
        // Redirect to dashboard after error
        setTimeout(() => {
          navigate('/landing');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    handlePaymentSuccess();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h2 className="text-xl font-semibold text-gray-900">Procesando pago...</h2>
            <p className="text-gray-500">Por favor, espera un momento mientras confirmamos tu pago.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">¡Pago exitoso!</h2>
            <p className="text-gray-500">Tu invitación ha sido publicada correctamente.</p>
            
            {publishedUrl && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Tu invitación está disponible en:</p>
                <a 
                  href={publishedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:text-rose-700 break-all"
                >
                  {publishedUrl}
                </a>
              </div>
            )}
            
            <p className="text-sm text-gray-400 mt-6">Serás redirigido al dashboard en unos segundos...</p>
          </div>
        )}
      </div>
    </div>
  );
}