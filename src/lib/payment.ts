import { supabase } from './supabase';

export async function createPayment() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No authenticated session');

    // First check if user already has an approved payment
    const { data: existingPayment, error: checkError } = await supabase
      .from('payments')
      .select('id, status')
      .eq('user_id', session.user.id)
      .eq('type', 'publication')
      .eq('status', 'approved')
      .maybeSingle();

    if (!checkError && existingPayment) {
      // User already has an approved payment, check if landing page is published
      const { data: landingPage, error: landingError } = await supabase
        .from('landing_pages')
        .select('published_at')
        .eq('user_id', session.user.id)
        .single();

      if (!landingError && !landingPage.published_at) {
        // Landing page is not published but payment is approved
        // Trigger publish action
        return {
          success: true,
          alreadyPaid: true
        };
      }
    }

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

    // Check if the response indicates the user already paid
    if (data.alreadyPaid) {
      return {
        success: true,
        alreadyPaid: true
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