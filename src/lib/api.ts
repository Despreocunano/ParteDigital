import { supabase } from './supabase';
import type { RsvpStatus } from '../types/supabase';

export async function updateRsvpStatus(
  attendeeId: string, 
  status: RsvpStatus
) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No hay una sesión autenticada');
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-rsvp-status`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        attendeeId,
        status,
      }),
    }
  );

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Error al actualizar el estado');
  }

  return data;
}

export async function sendEmail(
  attendeeId: string,
  subject: string,
  message: string
) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No hay una sesión autenticada');
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        attendeeId,
        subject,
        message,
      }),
    }
  );

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Error al enviar el correo');
  }

  return data;
}