import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Table } from '../types/supabase';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../lib/store';
import toast from 'react-hot-toast';

const TABLES_STORAGE_KEY = 'wedding_tables';

export function useTables() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { tables, setTables, addTable: addTableToStore, updateTable: updateTableInStore, removeTable } = useStore();

  const fetchTables = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      const tablesData = data || [];
      localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(tablesData));
      setTables(tablesData);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError(err as Error);
      
      // Fallback to localStorage if API fails
      const storedTables = localStorage.getItem(TABLES_STORAGE_KEY);
      if (storedTables) {
        setTables(JSON.parse(storedTables));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // First try to load from localStorage
    const storedTables = localStorage.getItem(TABLES_STORAGE_KEY);
    if (storedTables) {
      setTables(JSON.parse(storedTables));
      setLoading(false);
    }
    
    // Then fetch from API
    fetchTables();
  }, [user]);

  const addTable = async (tableData: Omit<Table, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { success: false, error: new Error('No hay usuario autenticado') };
    
    try {
      const newTable = {
        ...tableData,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('tables')
        .insert([newTable])
        .select()
        .single();
        
      if (error) throw error;

      const updatedTables = [...tables, data];
      localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(updatedTables));
      addTableToStore(data);
      
      toast.success('Mesa creada correctamente');
      return { success: true, data };
    } catch (err) {
      console.error('Error adding table:', err);
      toast.error('Error al crear mesa');
      return { success: false, error: err as Error };
    }
  };

  const updateTable = async (id: string, updates: Partial<Table>) => {
    if (!user) return { success: false, error: new Error('No hay usuario autenticado') };
    
    try {
      const { data, error } = await supabase
        .from('tables')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) throw error;

      const updatedTables = tables.map(t => t.id === id ? data : t);
      localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(updatedTables));
      updateTableInStore(id, data);
      
      toast.success('Mesa actualizada correctamente');
      return { success: true };
    } catch (err) {
      console.error('Error updating table:', err);
      toast.error('Error al actualizar mesa');
      return { success: false, error: err as Error };
    }
  };

  const deleteTable = async (id: string) => {
    if (!user) return { success: false, error: new Error('No hay usuario autenticado') };
    
    try {
      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;

      const updatedTables = tables.filter(t => t.id !== id);
      localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(updatedTables));
      removeTable(id);
      
      toast.success('Mesa eliminada correctamente');
      return { success: true };
    } catch (err) {
      console.error('Error deleting table:', err);
      toast.error('Error al eliminar mesa');
      return { success: false, error: err as Error };
    }
  };

  const assignGuestToTable = async (attendeeId: string, tableId: string | null) => {
    if (!user) return { success: false, error: new Error('No hay usuario autenticado') };
    
    try {
      if (tableId) {
        const table = tables.find(t => t.id === tableId);
        if (table) {
          const { data: currentAttendees } = await supabase
            .from('attendees')
            .select('id, has_plus_one, plus_one_rsvp_status')
            .eq('table_id', tableId);

          if (currentAttendees) {
            const seatsTaken = currentAttendees.reduce((total, attendee) => 
              total + (attendee.has_plus_one && attendee.plus_one_rsvp_status === 'confirmed' ? 2 : 1), 0
            );

            if (seatsTaken >= table.capacity) {
              throw new Error('La mesa está llena');
            }
          }
        }
      }

      const { error } = await supabase
        .from('attendees')
        .update({ table_id: tableId })
        .eq('id', attendeeId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast.success(tableId ? 'Invitado asignado correctamente' : 'Invitado removido de la mesa');
      return { success: true };
    } catch (err) {
      console.error('Error assigning guest to table:', err);
      toast.error(err instanceof Error ? err.message : 'Error al asignar invitado');
      return { success: false, error: err as Error };
    }
  };

  return {
    tables,
    loading,
    error,
    addTable,
    updateTable,
    deleteTable,
    assignGuestToTable,
    refreshTables: fetchTables
  };
}
