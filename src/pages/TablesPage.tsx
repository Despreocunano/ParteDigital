import { TableManager } from '../components/tables/TableManager';
import { useAttendees } from '../hooks/useAttendees';
import { useTables } from '../hooks/useTables';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../components/ui/Modal';
import { TableForm } from '../components/tables/TableForm';

export function TablesPage() {
  const { attendees, loading: attendeesLoading } = useAttendees();
  const { 
    tables, 
    loading: tablesLoading, 
    addTable, 
    updateTable, 
    deleteTable,
    assignGuestToTable
  } = useTables();
  const [showAddModal, setShowAddModal] = useState(false);

  const isLoading = attendeesLoading || tablesLoading;

  const handleAddTable = async (data: any) => {
    const result = await addTable(data);
    if (result.success) {
      setShowAddModal(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mesas</h1>
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-500">
            Organiza la distribución de tus invitados en las mesas
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className='bg-primary hover:bg-primary-dark text-primary-contrast'
          >
            Agregar Mesa
          </Button>
        </div>
      </div>
      
      <TableManager 
        tables={tables}
        attendees={attendees}
        isLoading={isLoading}
        onAddTable={addTable}
        onUpdateTable={updateTable}
        onDeleteTable={deleteTable}
        onAssignGuest={assignGuestToTable}
      />

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