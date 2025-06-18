import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Attendee, GuestTable } from '../../types/supabase';
import { TableAssignmentModal } from '../tables/TableAssignmentModal';
import { AttendeeAvatar } from './AttendeeAvatar';
import { AttendeeStatus } from './AttendeeStatus';
import { Edit2, Trash2, Send, Table2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { getInitials } from '../../lib/utils';

interface AttendeeCardProps {
  attendee: Attendee;
  attendees: Attendee[];
  tables: GuestTable[];
  onEdit: (attendee: Attendee) => void;
  onDelete: (id: string) => void;
  onSendReminder: (attendee: Attendee) => void;
  onAssignTable: (attendeeId: string, tableId: string | null) => Promise<{ success: boolean }>;
  sendingReminder: string | null;
}

export function AttendeeCard({ 
  attendee,
  attendees,
  tables, 
  onEdit, 
  onDelete, 
  onSendReminder,
  onAssignTable,
  sendingReminder
}: AttendeeCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const currentTable = tables.find(table => table.id === attendee.table_id);

  const getStatusColor = () => {
    switch (attendee.rsvp_status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 text-sm font-medium">
                {getInitials(attendee.first_name)}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">
                    {attendee.first_name}
                  </p>
                  {attendee.has_plus_one && (
                    <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                      +1
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="truncate">{attendee.email}</span>
                {attendee.phone && (
                    <>
                      <span>•</span>
                      <span className="truncate">{attendee.phone}</span>
                    </>
                )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div className={`flex flex-col p-2 rounded-md ${getStatusColor()}`}>
                <AttendeeStatus status={attendee.rsvp_status} />
              </div>
              <div className="flex p-2 rounded-md bg-gray-100 text-gray-800">
                <Table2 className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">
                  {currentTable ? currentTable.name : 'Sin mesa asignada'}
                </span>
              </div>
            </div>

            <div className="flex justify-items-auto space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSendReminder(attendee)}
                className="text-gray-600 hover:text-gray-900"
                isLoading={sendingReminder === attendee.id}
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onEdit(attendee);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(attendee.id);
          setShowDeleteModal(false);
        }}
        title="Eliminar Asistente"
        confirmText="Eliminar"
        isDanger
      >
        <p className="text-sm text-gray-500">
          ¿Estás seguro de que deseas eliminar a {attendee.first_name}?
        </p>
      </Modal>

      {showTableModal && (
        <TableAssignmentModal
          isOpen={true}
          onClose={() => setShowTableModal(false)}
          guest={attendee}
          tables={tables}
          attendees={attendees}
          onAssign={onAssignTable}
        />
      )}
    </>
  );
}