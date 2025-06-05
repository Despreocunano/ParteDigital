import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Guest, Table, Attendee } from '../../types/supabase';
import { getInitials } from '../../lib/utils';
import { Users, Grid } from 'lucide-react';
import { Button } from '../ui/Button';
import { TableAssignmentModal } from './TableAssignmentModal';

interface UnassignedGuestsProps {
  guests: Guest[];
  tables: Table[];
  attendees: Attendee[];
  onAssignTable: (guestId: string, tableId: string | null) => Promise<{ success: boolean }>;
}

export function UnassignedGuests({ guests, tables, attendees, onAssignTable }: UnassignedGuestsProps) {
  const [selectedGuest, setSelectedGuest] = React.useState<Attendee | null>(null);
  const unassignedAttendees = attendees.filter(attendee => 
    !attendee.table_id && 
    attendee.rsvp_status !== 'declined'
  );
  
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

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Invitados sin Mesa</CardTitle>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span>{unassignedAttendees.length} invitados</span>
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
                        {getInitials(attendee.first_name, attendee.last_name)}
                      </div>
                      <div className="ml-2 overflow-hidden">
                        <p className="text-sm font-medium truncate">
                          {attendee.first_name} {attendee.last_name}
                          {attendee.has_plus_one && attendee.plus_one_rsvp_status === 'confirmed' && ' (+1)'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{attendee.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedGuest(attendee)}
                    >
                      <Grid className="h-4 w-4" />
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
          onAssign={onAssignTable}
        />
      )}
    </>
  );
}