import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { GuestTable } from '../../types/supabase';

type FormData = {
  name: string;
  capacity: number;
};

interface TableFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  table?: GuestTable;
}

export function TableForm({ onSubmit, onCancel, isLoading, table }: TableFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: table?.name || '',
      capacity: table?.capacity || 8,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre de la Mesa"
        error={errors.name?.message}
        {...register('name', { required: 'El nombre de la mesa es requerido' })}
      />
      <Input
        label="Capacidad"
        type="number"
        error={errors.capacity?.message}
        {...register('capacity', {
          required: 'La capacidad es requerida',
          valueAsNumber: true,
          min: {
            value: 1,
            message: 'La capacidad debe ser al menos 1',
          },
          max: {
            value: 20,
            message: 'La capacidad no puede exceder 20',
          },
        })}
      />
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className='border border-primary text-primary hover:bg-primary-dark hover:text-primary-contrast'
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}
        className="flex-1 bg-primary hover:bg-primary-dark text-primary-contrast">
          {table ? 'Guardar' : 'Agregar Mesa'}
        </Button>
      </div>
    </form>
  );
}