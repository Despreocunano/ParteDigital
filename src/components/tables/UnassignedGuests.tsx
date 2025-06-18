import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { GuestTable, Attendee } from '../../types/supabase';
import { getInitials } from '../../lib/utils';
import { UserPlus } from 'lucide-react';
import { Button } from '../ui/Button';
import { TableAssignmentModal } from './TableAssignmentModal';

interface UnassignedGuestsProps {
  attendees: Attendee[];
  tables: GuestTable[];
  onAssignTable: (guestId: string, tableId: string | null) => Promise<{ success: boolean }>;
}

export function UnassignedGuests({ attendees, tables, onAssignTable }: UnassignedGuestsProps) {
  const [selectedGuest, setSelectedGuest] = React.useState<Attendee | null>(null);
  const [localAttendees, setLocalAttendees] = useState<Attendee[]>([]);
  
  useEffect(() => {
    setLocalAttendees(attendees);
  }, [attendees]);

  const unassignedAttendees = localAttendees
    .filter(attendee => 
      !attendee.table_id && 
      attendee.rsvp_status !== 'declined'
    )
    .sort((a, b) => {
      // Primero ordenar por estado de confirmación
      if (a.rsvp_status === 'confirmed' && b.rsvp_status !== 'confirmed') return -1;
      if (a.rsvp_status !== 'confirmed' && b.rsvp_status === 'confirmed') return 1;
      
      // Si tienen el mismo estado, ordenar por nombre
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleAssignTable = async (guestId: string, tableId: string | null): Promise<{ success: boolean }> => {
    const result = await onAssignTable(guestId, tableId);
    if (result.success) {
      // Update local state immediately
      setLocalAttendees(prev => 
        prev.map(a => 
          a.id === guestId 
            ? { ...a, table_id: tableId }
            : a
        )
      );
      setSelectedGuest(null);
    }
    return result;
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Invitados sin Mesa</CardTitle>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <UserPlus className="h-4 w-4 mr-1" />
                <span>
                  {unassignedAttendees.filter(a => a.rsvp_status === 'confirmed').length} confirmados,{' '}
                  {unassignedAttendees.filter(a => a.rsvp_status === 'pending').length} pendientes
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {unassignedAttendees.length > 0 ? (
              unassignedAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className={`p-2 border rounded-md ${getStatusColor(attendee.rsvp_status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 text-xs font-medium">
                        {getInitials(attendee.first_name)}
                      </div>
                      <div className="ml-2 overflow-hidden">
                        <p className="text-sm font-medium truncate">
                          {attendee.first_name}
                          {attendee.has_plus_one && ' (+1)'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedGuest(attendee)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
                Todos los invitados tienen mesa asignada
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedGuest && (
        <TableAssignmentModal
          isOpen={true}
          onClose={() => setSelectedGuest(null)}
          guest={selectedGuest}
          tables={tables}
          attendees={attendees}
          onAssign={handleAssignTable}
        />
      )}
    </>
  );
}