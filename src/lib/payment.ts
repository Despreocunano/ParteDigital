import { supabase } from './supabase';

export async function createPayment() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No authenticated session');

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    
    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Error al crear el pago',
        alreadyPublished: data.alreadyPublished || false
      };
    }

    return {
      success: true,
      preferenceId: data.preferenceId,
      initPoint: data.initPoint
    };
  } catch (error) {
    console.error('Error creating payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

export async function checkPaymentStatus(preferenceId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No authenticated session');

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-payment-status?preference_id=${preferenceId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Error al verificar el estado del pago'
      };
    }

    return {
      success: true,
      payment: data.payment,
      landingPage: data.landingPage
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}