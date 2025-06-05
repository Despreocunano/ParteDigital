import React from 'react';
import { Button } from '../ui/Button';
import { Edit, Trash2, Send, Grid } from 'lucide-react';

interface AttendeeActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onSendReminder: () => void;
  onAssignTable: () => void;
  showAssignTable?: boolean;
}

export function AttendeeActions({
  onEdit,
  onDelete,
  onSendReminder,
  onAssignTable,
  showAssignTable = true
}: AttendeeActionsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {showAssignTable && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAssignTable}
          className="flex flex-col items-center p-2"
        >
          <Grid className="h-4 w-4 mb-1" />
          <span className="text-xs">Asignar</span>
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onSendReminder}
        className="flex flex-col items-center p-2"
      >
        <Send className="h-4 w-4 mb-1" />
        <span className="text-xs">Recordar</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="flex flex-col items-center p-2"
      >
        <Edit className="h-4 w-4 mb-1" />
        <span className="text-xs">Editar</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="flex flex-col items-center p-2"
      >
        <Trash2 className="h-4 w-4 mb-1 text-red-500" />
        <span className="text-xs text-red-500">Eliminar</span>
      </Button>
    </div>
  );
}