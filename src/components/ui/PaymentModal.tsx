import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  description: string;
  paymentType: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  description,
  paymentType
}: PaymentModalProps) {
  const { user } = useAuth();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isCreatingPreference, setIsCreatingPreference] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);

  // Initialize MercadoPago
  useEffect(() => {
    if (isOpen) {
      initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);
      createPaymentPreference();
    }
  }, [isOpen]);

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
          amount,
          description,
          paymentType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        if (data.alreadyPaid) {
          toast.success('Ya has realizado este pago anteriormente');
          onSuccess();
          onClose();
        } else {
          setPreferenceId(data.preferenceId);
        }
      } else {
        throw new Error(data.error || 'Error al crear la preferencia de pago');
      }
    } catch (error) {
      console.error('Error creating payment preference:', error);
      toast.error('Error al crear la preferencia de pago');
      onClose();
    } finally {
      setIsCreatingPreference(false);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'approved':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-16 w-16 text-red-500" />;
      case 'pending':
        return <Clock className="h-16 w-16 text-amber-500" />;
      default:
        return <CreditCard className="h-16 w-16 text-gray-500" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Realizar Pago"
    >
      <div className="space-y-6">
        {paymentStatus ? (
          <div className="text-center py-6">
            <div className="mx-auto mb-4">
              {getStatusIcon()}
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {paymentStatus === 'approved' ? '¡Pago completado!' : 
               paymentStatus === 'rejected' ? 'Pago rechazado' : 
               'Pago en proceso'}
            </h3>
            <p className="text-gray-600 mb-6">
              {paymentStatus === 'approved' ? 'Tu pago ha sido procesado correctamente.' : 
               paymentStatus === 'rejected' ? 'Ha ocurrido un error al procesar tu pago. Por favor, intenta nuevamente.' : 
               'Tu pago está siendo procesado. Te notificaremos cuando se complete.'}
            </p>
            <Button
              onClick={paymentStatus === 'approved' ? onSuccess : onClose}
              className={`w-full ${
                paymentStatus === 'approved' ? 'bg-green-500 hover:bg-green-600' : 
                paymentStatus === 'rejected' ? 'bg-red-500 hover:bg-red-600' : 
                'bg-amber-500 hover:bg-amber-600'
              } text-white`}
            >
              {paymentStatus === 'approved' ? 'Continuar' : 'Cerrar'}
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{description}</h3>
                  <p className="text-sm text-gray-500">
                    Pago único
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <span className="text-gray-700">Total a pagar:</span>
                <span className="text-xl font-semibold text-gray-900">${amount.toLocaleString('es-CL')} CLP</span>
              </div>
            </div>

            {isCreatingPreference ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
              </div>
            ) : preferenceId ? (
              <div className="w-full">
                <Wallet 
                  initialization={{ preferenceId }}
                  onReady={() => console.log('Wallet ready')}
                  onError={(error) => {
                    console.error('Wallet error:', error);
                    toast.error('Error al cargar el método de pago');
                  }}
                  customization={{
                    visual: {
                      hideValueProp: false,
                      buttonBackground: 'default',
                      borderRadius: 'md',
                    }
                  }}
                />
              </div>
            ) : null}

            <p className="text-sm text-gray-500 text-center">
              Al completar el pago, podrás continuar con el proceso.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}