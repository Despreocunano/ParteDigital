import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Attendee, Table } from '../../types/supabase';
import toast from 'react-hot-toast';

interface TableAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: Attendee;
  table?: Table;
  tables?: Table[];
  attendees?: Attendee[];
  onAssign?: (guestId: string, tableId: string | null) => Promise<{ success: boolean }>;
  onSave?: (table: Table) => void;
}

export function TableAssignmentModal({
  isOpen,
  onClose,
  guest,
  table,
  tables = [],
  attendees = [],
  onAssign,
  onSave,
}: TableAssignmentModalProps) {
  const [selectedTableId, setSelectedTableId] = useState<string>(guest?.table_id || '');
  const [tableName, setTableName] = useState(table?.name || '');
  const [tableCapacity, setTableCapacity] = useState(table?.capacity?.toString() || '8');
  const [isLoading, setIsLoading] = useState(false);

  const handleAssign = async () => {
    if (!guest || !onAssign) return;

    if (guest.rsvp_status !== 'confirmed') {
      toast.error('El invitado debe confirmar su asistencia antes de asignar una mesa');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onAssign(guest.id, selectedTableId || null);
      if (!result.success) {
        toast.error('Error al asignar mesa');
      }
      onClose();
    } catch (error) {
      console.error('Error assigning table:', error);
      toast.error('Error al asignar mesa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!table || !onSave) return;

    const capacity = parseInt(tableCapacity);
    if (isNaN(capacity) || capacity < 1) {
      toast.error('La capacidad debe ser un número mayor a 0');
      return;
    }

    if (!tableName.trim()) {
      toast.error('El nombre de la mesa es requerido');
      return;
    }

    onSave({
      ...table,
      name: tableName,
      capacity,
    });
  };

  const getTableAssignedSeats = (tableId: string) => {
    if (!Array.isArray(attendees)) return 0;
    
    const assignedAttendees = attendees.filter(a => a.table_id === tableId);
    return assignedAttendees.reduce((total, attendee) => {
      let seats = 1;
      if (attendee.has_plus_one) {
        seats++;
      }
      return total + seats;
    }, 0);
  };

  const getRequiredSeats = () => {
    if (!guest) return 0;
    let seats = 1;
    if (guest.has_plus_one) {
      seats++;
    }
    return seats;
  };

  const availableTables = tables.map(table => {
    const assignedSeats = getTableAssignedSeats(table.id);
    const requiredSeats = getRequiredSeats();
    const isFull = (assignedSeats + requiredSeats > table.capacity) && guest?.table_id !== table.id;
    
    return {
      value: table.id,
      label: `${table.name} (${assignedSeats}/${table.capacity})${isFull ? ' - Mesa llena' : ''}`,
      disabled: isFull,
    };
  });

  if (table) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleSave}
        title={`${table.id ? 'Editar' : 'Crear'} Mesa`}
        confirmText={table.id ? 'Guardar' : 'Crear'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre de la Mesa"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="Ej: Mesa 1"
          />

          <Input
            label="Capacidad"
            type="number"
            min="1"
            value={tableCapacity}
            onChange={(e) => setTableCapacity(e.target.value)}
          />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleAssign}
      title="Asignar Mesa"
      confirmText="Asignar"
      isDanger={false}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {guest && (
          <p className="text-sm text-gray-500">
            Asignar mesa para {guest.first_name} {guest.last_name}
            {guest.has_plus_one && ' (+1)'}
          </p>
        )}

        {guest?.rsvp_status !== 'confirmed' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-700">
              El invitado debe confirmar su asistencia antes de asignar una mesa
            </p>
          </div>
        )}

        <Select
          label="Seleccionar Mesa"
          value={selectedTableId}
          onChange={(e) => setSelectedTableId(e.target.value)}
          options={[
            { value: '', label: 'Sin mesa asignada', disabled: false },
            ...availableTables
          ]}
        />
      </div>
    </Modal>
  );
}