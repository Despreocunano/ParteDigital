import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Attendee, RsvpStatus } from '../types/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function useAttendees() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

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

  return {
    attendees,
    loading,
    error,
    addAttendee,
    updateAttendee,
    updateRsvpStatus,
    deleteAttendee,
    refreshAttendees: fetchAttendees
  };
}