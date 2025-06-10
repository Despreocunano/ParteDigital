import React, { useState } from 'react';
import { useAttendees } from '../hooks/useAttendees';
import { useTables } from '../hooks/useTables';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Search } from 'lucide-react';
import { AttendeeCard } from '../components/attendees/AttendeeCard';
import { AttendeeForm } from '../components/attendees/AttendeeForm';
import type { Attendee } from '../types/supabase';
import { toast } from 'react-hot-toast';

export function AttendeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAttendee, setEditingAttendee] = useState<Attendee | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  
  const { 
    attendees, 
    loading: attendeesLoading,
    addAttendee,
    updateAttendee,
    deleteAttendee,
    updateRsvpStatus,
    sendReminder
  } = useAttendees();
  
  const {
    tables,
    loading: tablesLoading,
    assignGuestToTable
  } = useTables();

  const filteredAttendees = attendees.filter((attendee) => {
    const fullName = `${attendee.first_name} ${attendee.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddAttendee = async (data: any) => {
    setFormLoading(true);
    try {
      const result = await addAttendee({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || null,
        rsvp_status: data.rsvp_status,
        dietary_restrictions: data.dietary_restrictions || null,
        needs_accommodation: data.needs_accommodation,
        accommodation_notes: data.accommodation_notes || null,
        has_plus_one: data.has_plus_one,
        plus_one_name: data.plus_one_name || null,
        plus_one_dietary_restrictions: data.plus_one_dietary_restrictions || null,
        plus_one_rsvp_status: data.plus_one_rsvp_status || null,
      });
      
      if (result.success) {
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding attendee:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateAttendee = async (data: any) => {
    if (!editingAttendee) return;
    
    setFormLoading(true);
    try {
      const result = await updateAttendee(editingAttendee.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || null,
        rsvp_status: data.rsvp_status,
        dietary_restrictions: data.dietary_restrictions || null,
        needs_accommodation: data.needs_accommodation,
        accommodation_notes: data.accommodation_notes || null,
        has_plus_one: data.has_plus_one,
        plus_one_name: data.plus_one_name || null,
        plus_one_dietary_restrictions: data.plus_one_dietary_restrictions || null,
        plus_one_rsvp_status: data.plus_one_rsvp_status || null,
      });
      
      if (result.success) {
        setEditingAttendee(null);
      }
    } catch (error) {
      console.error('Error updating attendee:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSendReminder = async (attendee: Attendee) => {
    try {
      setSendingReminder(attendee.id);
      await sendReminder(attendee.id);
      toast.success('Recordatorio enviado');
    } catch (error) {
      toast.error('Error al enviar el recordatorio');
    } finally {
      setSendingReminder(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invitados</h1>
        <p className="text-gray-500 mt-1">
          Gestiona la lista de invitados y sus confirmaciones
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar invitados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            Agregar Invitado
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Agregar Invitado</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendeeForm 
              onSubmit={handleAddAttendee}
              onCancel={() => setShowAddForm(false)}
              isLoading={formLoading}
            />
          </CardContent>
        </Card>
      )}

      {editingAttendee && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Editar Invitado</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendeeForm
              attendee={editingAttendee}
              onSubmit={handleUpdateAttendee}
              onCancel={() => setEditingAttendee(null)}
              isLoading={formLoading}
            />
          </CardContent>
        </Card>
      )}

      {attendeesLoading || tablesLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
        </div>
      ) : filteredAttendees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttendees.map((attendee) => (
            <AttendeeCard
              key={attendee.id}
              attendee={attendee}
              attendees={attendees}
              tables={tables}
              onEdit={setEditingAttendee}
              onDelete={deleteAttendee}
              onSendReminder={handleSendReminder}
              onAssignTable={assignGuestToTable}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No se encontraron invitados' : 'No hay invitados registrados'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowAddForm(true)}>
                  Agregar Primer Invitado
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}