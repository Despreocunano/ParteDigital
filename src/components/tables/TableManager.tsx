import React, { useState, useEffect } from 'react';
import { useTables } from '../../hooks/useTables';
import { useAttendees } from '../../hooks/useAttendees';
import { TableCard } from './TableCard';
import { UnassignedGuests } from './UnassignedGuests';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';
import { Table, Attendee } from '../../types/supabase';
import { TableAssignmentModal } from './TableAssignmentModal';
import { TableForm } from './TableForm';
import { Modal } from '../ui/Modal';

interface TableManagerProps {
  tables: Table[];
  attendees: Attendee[];
  isLoading: boolean;
  onAddTable: (data: any) => Promise<{ success: boolean }>;
  onUpdateTable: (id: string, data: any) => Promise<{ success: boolean }>;
  onDeleteTable: (id: string) => Promise<{ success: boolean }>;
  onAssignGuest: (guestId: string, tableId: string | null) => Promise<{ success: boolean }>;
}

export function TableManager({
  tables,
  attendees,
  isLoading,
  onAddTable,
  onUpdateTable,
  onDeleteTable,
  onAssignGuest
}: TableManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [localAttendees, setLocalAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    setLocalAttendees(attendees);
  }, [attendees]);

  const handleAddTable = async (data: any) => {
    const result = await onAddTable(data);
    if (result.success) {
      setShowAddModal(false);
    }
  };

  const handleUpdateTable = async (table: Table) => {
    await onUpdateTable(table.id, {
      name: table.name,
      capacity: table.capacity
    });
  };

  const handleAssignGuest = async (guestId: string, tableId: string | null) => {
    const result = await onAssignGuest(guestId, tableId);
    if (result.success) {
      // Update local state immediately
      setLocalAttendees(prev => 
        prev.map(a => 
          a.id === guestId 
            ? { ...a, table_id: tableId }
            : a
        )
      );
    }
    return result;
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-[400px]">
            <UnassignedGuests 
              attendees={localAttendees}
              tables={tables}
              onAssignTable={handleAssignGuest}
            />
          </div>
          
          {tables.map((table) => (
            <div key={table.id} className="h-[400px]">
              <TableCard
                table={table}
                attendees={localAttendees}
                onEdit={handleUpdateTable}
                onDelete={onDeleteTable}
                onAssignTable={handleAssignGuest}
              />
            </div>
          ))}
          
          {tables.length === 0 && (
            <div className="md:col-span-2 lg:col-span-2 flex items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <p className="text-gray-500 mb-4">No hay mesas creadas aún</p>
                <Button onClick={() => setShowAddModal(true)}>
                  Crear Primera Mesa
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowAddModal(false)}
          title="Agregar Mesa"
        >
          <TableForm
            onSubmit={handleAddTable}
            onCancel={() => setShowAddModal(false)}
            isLoading={false}
          />
        </Modal>
      )}
    </div>
  );
}