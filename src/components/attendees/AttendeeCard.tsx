import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Attendee, Table } from '../../types/supabase';
import { TableAssignmentModal } from '../tables/TableAssignmentModal';
import { AttendeeAvatar } from './AttendeeAvatar';
import { AttendeeStatus } from './AttendeeStatus';
import { Edit2, Trash2, Send, Table2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface AttendeeCardProps {
  attendee: Attendee;
  attendees: Attendee[];
  tables: Table[];
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
              <AttendeeAvatar 
                firstName={attendee.first_name}
                lastName={attendee.last_name}
                size="lg"
              />
              <div className="ml-3">
                <h3 className="text-base font-medium text-gray-900">
                  {attendee.first_name} {attendee.last_name}
                  {attendee.has_plus_one && attendee.plus_one_name && ` (+ ${attendee.plus_one_name})`}
                </h3>
                <p className="text-sm text-gray-500">{attendee.email}</p>
                {attendee.phone && (
                  <p className="text-sm text-gray-500">{attendee.phone}</p>
                )}
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
                onClick={() => onEdit(attendee)}
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
          ¿Estás seguro de que deseas eliminar a {attendee.first_name} {attendee.last_name}?
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