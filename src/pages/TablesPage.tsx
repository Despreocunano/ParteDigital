import { TableManager } from '../components/tables/TableManager';
import { useAttendees } from '../hooks/useAttendees';
import { useTables } from '../hooks/useTables';

export function TablesPage() {
  const { attendees, loading: attendeesLoading, refreshAttendees } = useAttendees();
  const { 
    tables, 
    loading: tablesLoading, 
    addTable, 
    updateTable, 
    deleteTable,
    assignGuestToTable,
    refreshTables
  } = useTables();

  const isLoading = attendeesLoading || tablesLoading;

  const handleRefresh = async () => {
    await Promise.all([
      refreshTables(),
      refreshAttendees()
    ]);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mesas</h1>
        <p className="text-gray-500 mt-1">
          Organiza la distribución de tus invitados en las mesas
        </p>
      </div>
      
      <TableManager 
        tables={tables}
        guests={[]} // We keep this for backward compatibility
        attendees={attendees}
        isLoading={isLoading}
        onAddTable={addTable}
        onUpdateTable={updateTable}
        onDeleteTable={deleteTable}
        onAssignGuest={assignGuestToTable}
        onRefresh={handleRefresh}
      />
    </div>
  );
}