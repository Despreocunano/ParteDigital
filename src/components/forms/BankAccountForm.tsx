import { Input } from '../ui/Input';
import { useForm } from 'react-hook-form';

interface BankAccountFormData {
  accountHolder: string;
  rut: string;
  bank: string;
  accountType: string;
  accountNumber: string;
  email: string;
}

interface BankAccountFormProps {
  onSubmit: (data: BankAccountFormData) => void;
  isLoading?: boolean;
  defaultValues?: Partial<BankAccountFormData>;
}

export function BankAccountForm({ onSubmit, isLoading, defaultValues }: BankAccountFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BankAccountFormData>({
    defaultValues: {
      accountHolder: defaultValues?.accountHolder || '',
      rut: defaultValues?.rut || '',
      bank: defaultValues?.bank || '',
      accountType: defaultValues?.accountType || '',
      accountNumber: defaultValues?.accountNumber || '',
      email: defaultValues?.email || ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre del Titular"
        {...register('accountHolder', { required: 'El nombre del titular es requerido' })}
        error={errors.accountHolder?.message}
      />

      <Input
        label="RUT"
        {...register('rut', { 
          required: 'El RUT es requerido',
          pattern: {
            value: /^[0-9]{7,8}-[0-9kK]{1}$/,
            message: 'RUT inválido (formato: 12345678-9)'
          }
        })}
        placeholder="12345678-9"
        error={errors.rut?.message}
      />

      <Input
        label="Banco"
        {...register('bank', { required: 'El banco es requerido' })}
        error={errors.bank?.message}
      />

      <Input
        label="Tipo de Cuenta"
        {...register('accountType', { required: 'El tipo de cuenta es requerido' })}
        placeholder="Cuenta Corriente, Cuenta Vista, etc."
        error={errors.accountType?.message}
      />

      <Input
        label="Número de Cuenta"
        {...register('accountNumber', { required: 'El número de cuenta es requerido' })}
        error={errors.accountNumber?.message}
      />

      <Input
        label="Correo Electrónico"
        type="email"
        {...register('email', {
          required: 'El correo electrónico es requerido',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Correo electrónico inválido'
          }
        })}
        error={errors.email?.message}
      />
    </form>
  );
}