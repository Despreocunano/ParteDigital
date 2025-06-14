import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [status, setStatus] = useState<'success' | 'failure' | 'pending' | 'loading'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('success')) {
      setStatus('success');
    } else if (path.includes('failure')) {
      setStatus('failure');
    } else if (path.includes('pending')) {
      setStatus('pending');
    }

    const checkPayment = async () => {
      if (!user) return;
      
      try {
        const params = new URLSearchParams(location.search);
        const paymentId = params.get('payment_id');
        const externalReference = params.get('external_reference');
        
        if (paymentId || externalReference) {
          const query = supabase
            .from('payments')
            .select('*')
            .eq('user_id', user.id);
            
          if (paymentId) {
            query.eq('payment_id', paymentId);
          } else if (externalReference) {
            query.eq('external_reference', externalReference);
          }
          
          const { data, error } = await query.order('created_at', { ascending: false }).limit(1).single();
          
          if (error) {
            console.error('Error fetching payment:', error);
          } else if (data) {
            setPaymentDetails(data);
            setStatus(data.status === 'approved' ? 'success' : data.status === 'pending' ? 'pending' : 'failure');
          }
        }
      } catch (error) {
        console.error('Error checking payment:', error);
      }
    };
    
    checkPayment();
  }, [location, user]);

  const getContent = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: '¡Pago completado con éxito!',
          description: 'Tu invitación ha sido publicada y ya está disponible para compartir con tus invitados.',
          buttonText: 'Ir a mi invitación',
          buttonAction: () => navigate('/landing'),
          buttonColor: 'bg-green-500 hover:bg-green-600'
        };
      case 'failure':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Error en el pago',
          description: 'Ha ocurrido un error al procesar tu pago. Por favor, intenta nuevamente.',
          buttonText: 'Volver a intentar',
          buttonAction: () => navigate('/landing'),
          buttonColor: 'bg-red-500 hover:bg-red-600'
        };
      case 'pending':
        return {
          icon: <Clock className="h-16 w-16 text-amber-500" />,
          title: 'Pago en proceso',
          description: 'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
          buttonText: 'Volver a mi invitación',
          buttonAction: () => navigate('/landing'),
          buttonColor: 'bg-amber-500 hover:bg-amber-600'
        };
      default:
        return {
          icon: <Clock className="h-16 w-16 text-gray-500 animate-spin" />,
          title: 'Verificando pago',
          description: 'Estamos verificando el estado de tu pago...',
          buttonText: 'Volver a mi invitación',
          buttonAction: () => navigate('/landing'),
          buttonColor: 'bg-gray-500 hover:bg-gray-600'
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-6">
            {content.icon}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h1>
          <p className="text-gray-600 mb-6">{content.description}</p>
          
          {paymentDetails && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg text-left">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Detalles del pago:</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Descripción:</span> {paymentDetails.description}</p>
                <p><span className="text-gray-500">Monto:</span> ${paymentDetails.amount.toLocaleString('es-CL')} CLP</p>
                <p><span className="text-gray-500">Estado:</span> {
                  paymentDetails.status === 'approved' ? 'Aprobado' : 
                  paymentDetails.status === 'pending' ? 'Pendiente' : 'Rechazado'
                }</p>
                <p><span className="text-gray-500">Fecha:</span> {new Date(paymentDetails.created_at).toLocaleString('es-CL')}</p>
              </div>
            </div>
          )}
          
          <Button
            onClick={content.buttonAction}
            className={`w-full ${content.buttonColor} text-white`}
          >
            {content.buttonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}