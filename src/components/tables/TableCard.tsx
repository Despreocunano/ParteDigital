import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Edit, Trash2, Users, X, Plus, Search } from 'lucide-react';
import { Guest, Table, Attendee } from '../../types/supabase';
import { getInitials } from '../../lib/utils';
import { TableAssignmentModal } from './TableAssignmentModal';
import { Input } from '../ui/Input';

interface TableCardProps {
  table: Table;
  tables: Table[];
  guests: Guest[];
  attendees: Attendee[];
  onEdit: (table: Table) => void;
  onDelete: (id: string) => void;
  onAssignTable: (guestId: string, tableId: string | null) => Promise<{ success: boolean }>;
}

export function TableCard({ 
  table, 
  tables, 
  guests, 
  attendees,
  onEdit, 
  onDelete, 
  onAssignTable 
}: TableCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const assignedAttendees = attendees.filter(attendee => attendee.table_id === table.id);
  const unassignedAttendees = attendees.filter(attendee => 
    !attendee.table_id && 
    attendee.rsvp_status === 'confirmed' &&
    (
      attendee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  const totalSeats = assignedAttendees.reduce((total, attendee) => {
    let seats = 1;
    if (attendee.has_plus_one && attendee.plus_one_rsvp_status === 'confirmed') {
      seats++;
    }
    return total + seats;
  }, 0);
  
  const availableSeats = table.capacity - totalSeats;
  
  const getCapacityColor = () => {
    const occupancyRate = (totalSeats / table.capacity) * 100;
    if (occupancyRate >= 100) return 'bg-amber-100 text-amber-800';
    if (occupancyRate >= 75) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const handleAssignAttendee = async (attendee: Attendee) => {
    if (attendee.rsvp_status !== 'confirmed') {
      return;
    }
    
    await onAssignTable(attendee.id, table.id);
    setSearchTerm('');
  };

  const handleRemoveFromTable = async (attendee: Attendee) => {
    await onAssignTable(attendee.id, null);
  };

  const handleDeleteTable = async () => {
    // First remove all attendees from the table
    const promises = assignedAttendees.map(attendee => 
      onAssignTable(attendee.id, null)
    );
    
    await Promise.all(promises);
    
    // Then delete the table
    await onDelete(table.id);
    setShowDeleteModal(false);
  };

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
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{table.name}</span>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEditModal(true)}
                    aria-label="Editar Mesa"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    aria-label="Eliminar Mesa"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardTitle>
              
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className={`flex items-center justify-center p-2 rounded-md ${getCapacityColor()}`}>
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {totalSeats}/{table.capacity}
                  </span>
                </div>
                <div className="flex items-center justify-center p-2 rounded-md bg-gray-100 text-gray-800">
                  {availableSeats > 0 ? (
                    <span className="text-sm font-medium">
                      {availableSeats} asientos disponibles
                    </span>
                  ) : (
                    <span className="text-sm font-medium">
                      Mesa llena
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      availableSeats === 0 
                        ? 'bg-amber-500' 
                        : totalSeats >= table.capacity * 0.75
                        ? 'bg-orange-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((totalSeats / table.capacity) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar invitados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchTerm && unassignedAttendees.length > 0 && (
              <div className="border rounded-md divide-y">
                {unassignedAttendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className={`flex items-center justify-between p-3 ${getStatusColor(attendee.rsvp_status)}`}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 text-xs font-medium">
                        {getInitials(attendee.first_name, attendee.last_name)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          {attendee.first_name} {attendee.last_name}
                          {attendee.has_plus_one && attendee.plus_one_rsvp_status === 'confirmed' && ' (+1)'}
                        </p>
                        <p className="text-xs text-gray-500">{attendee.email}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAssignAttendee(attendee)}
                      disabled={availableSeats === 0}
                      title={availableSeats === 0 ? 'Mesa llena' : 'Asignar a esta mesa'}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {assignedAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className={`p-2 border rounded-md ${getStatusColor(attendee.rsvp_status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 text-xs font-medium">
                        {getInitials(attendee.first_name, attendee.last_name)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          {attendee.first_name} {attendee.last_name}
                          {attendee.has_plus_one && attendee.plus_one_rsvp_status === 'confirmed' && ' (+1)'}
                        </p>
                        <p className="text-xs text-gray-500">{attendee.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFromTable(attendee)}
                      title="Remover de esta mesa"
                    >
                      <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteTable}
        title="Eliminar Mesa"
        confirmText="Eliminar"
        isDanger
      >
        <p className="text-sm text-gray-500">
          ¿Estás seguro de que deseas eliminar la mesa {table.name}?
        </p>
      </Modal>

      {showEditModal && (
        <TableAssignmentModal
          isOpen={true}
          onClose={() => setShowEditModal(false)}
          table={table}
          onSave={(updatedTable) => {
            onEdit(updatedTable);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
}