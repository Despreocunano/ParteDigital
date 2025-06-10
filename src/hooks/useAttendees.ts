import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Attendee, RsvpStatus } from '../types/supabase';
import { useAuth } from '../context/AuthContext';
import { useWedding } from '../hooks/useWedding';
import toast from 'react-hot-toast';
import { sendEmail } from '../lib/api';

export function useAttendees() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { groomName, brideName, profileImage } = useWedding();

  const fetchAttendees = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setAttendees(data || []);
    } catch (err) {
      console.error('Error fetching attendees:', err);
      setError(err instanceof Error ? err : new Error('Error fetching attendees'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();

    const channel = supabase.channel('attendees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendees',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchAttendees();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const addAttendee = async (data: Omit<Attendee, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { success: false };
    
    try {
      const { data: newAttendee, error } = await supabase
        .from('attendees')
        .insert([{ ...data, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setAttendees(prev => [...prev, newAttendee]);
      toast.success('Invitado agregado correctamente');
      return { success: true, data: newAttendee };
    } catch (err) {
      console.error('Error adding attendee:', err);
      toast.error('Error al agregar invitado');
      return { success: false };
    }
  };

  const updateAttendee = async (id: string, updates: Partial<Attendee>) => {
    if (!user) return { success: false };

    try {
      const { data, error } = await supabase
        .from('attendees')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setAttendees(prev => 
        prev.map(attendee => 
          attendee.id === id ? { ...attendee, ...data } : attendee
        )
      );
      
      toast.success('Invitado actualizado correctamente');
      return { success: true, data };
    } catch (err) {
      console.error('Error updating attendee:', err);
      toast.error('Error al actualizar invitado');
      return { success: false };
    }
  };

  const updateRsvpStatus = async (id: string, status: RsvpStatus, plusOneStatus?: RsvpStatus) => {
    if (!user) return { success: false };

    try {
      const updates: Partial<Attendee> = {
        rsvp_status: status,
        updated_at: new Date().toISOString(),
      };

      if (plusOneStatus !== undefined) {
        updates.plus_one_rsvp_status = plusOneStatus;
      }

      const { data, error } = await supabase
        .from('attendees')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setAttendees(prev => 
        prev.map(attendee => 
          attendee.id === id ? { ...attendee, ...data } : attendee
        )
      );
      
      toast.success('Estado actualizado correctamente');
      return { success: true, data };
    } catch (err) {
      console.error('Error updating RSVP status:', err);
      toast.error('Error al actualizar estado');
      return { success: false };
    }
  };

  const deleteAttendee = async (id: string) => {
    if (!user) return { success: false };

    try {
      const { error } = await supabase
        .from('attendees')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setAttendees(prev => prev.filter(attendee => attendee.id !== id));
      toast.success('Invitado eliminado correctamente');
      return { success: true };
    } catch (err) {
      console.error('Error deleting attendee:', err);
      toast.error('Error al eliminar invitado');
      return { success: false };
    }
  };

  const sendReminder = async (id: string) => {
    if (!user) return { success: false };

    try {
      const attendee = attendees.find(a => a.id === id);
      if (!attendee) throw new Error('Attendee not found');

      // Get landing page data
      const { data: landingPage, error: landingError } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (landingError) throw new Error('Error fetching landing page');

      const landingUrl = landingPage?.slug 
        ? `https://tuparte.digital/invitacion/${landingPage.slug}`
        : '';

      const signature = `
<br><br>
<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
  <table cellpadding="0" cellspacing="0" style="border: none;">
    <tr>
      <td style="vertical-align: middle; padding-right: 15px;">
        <img src="${profileImage || 'https://images.pexels.com/photos/931158/pexels-photo-931158.jpeg?w=50&h=50'}" alt="Logo" style="width: 50px; height: 50px; border-radius: 50%;">
      </td>
      <td style="vertical-align: middle;">
        <div style="font-family: 'Playfair Display', serif; color: #B76E79; font-size: 18px;">
          ${groomName} & ${brideName}
        </div>
        <div style="font-family: Arial, sans-serif; color: #666; font-size: 14px; margin-top: 4px;">
          ¡Gracias por ser parte de nuestra historia!
        </div>
      </td>
    </tr>
  </table>
</div>`;

      const message = `
Hola ${attendee.first_name},

Te recordamos que aún no has confirmado tu asistencia a nuestra boda. Por favor, confirma tu asistencia lo antes posible.

${landingUrl ? `Puedes ver todos los detalles y confirmar tu asistencia en nuestra invitación digital: ${landingUrl}` : ''}

¡Gracias!${signature}`;

      await sendEmail(
        id,
        'Recordatorio de invitación',
        message
      );

      toast.success('Recordatorio enviado correctamente');
      return { success: true };
    } catch (err) {
      console.error('Error sending reminder:', err);
      toast.error('Error al enviar recordatorio');
      return { success: false };
    }
  };

  return {
    attendees,
    loading,
    error,
    addAttendee,
    updateAttendee,
    updateRsvpStatus,
    deleteAttendee,
    sendReminder,
    refreshAttendees: fetchAttendees
  };
}