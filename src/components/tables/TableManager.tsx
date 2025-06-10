import { useState } from 'react';
import { Button } from '../ui/Button';
import { TableCard } from './TableCard';
import { UnassignedGuests } from './UnassignedGuests';
import { Plus, RefreshCw } from 'lucide-react';
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
  onRefresh: () => void;
}

export function TableManager({
  tables,
  attendees,
  isLoading,
  onAddTable,
  onUpdateTable,
  onDeleteTable,
  onAssignGuest,
  onRefresh
}: TableManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddTable = async (data: any) => {
    const result = await onAddTable(data);
    if (result.success) {
      setShowAddModal(false);
      handleRefresh();
    }
  };

  const handleUpdateTable = async (table: Table) => {
    await onUpdateTable(table.id, {
      name: table.name,
      capacity: table.capacity
    });
    handleRefresh();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Mesas</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? '' : 'hover:animate-spin'}`} />}
          >
            Actualizar
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Agregar Mesa
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-[400px]">
            <UnassignedGuests 
              tables={tables}
              attendees={attendees}
              onAssignTable={onAssignGuest}
            />
          </div>
          
          {tables.map((table) => (
            <div key={table.id} className="h-[400px]">
              <TableCard
                table={table}
                attendees={attendees}
                onEdit={handleUpdateTable}
                onDelete={onDeleteTable}
                onAssignTable={onAssignGuest}
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