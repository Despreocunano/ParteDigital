import { CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { LandingPageFormData } from '../../../types/landing';

interface BankInfoSectionProps {
  register: UseFormRegister<LandingPageFormData>;
  errors: FieldErrors<LandingPageFormData>;
  watch: UseFormWatch<LandingPageFormData>;
  setValue: UseFormSetValue<LandingPageFormData>;
}

export function BankInfoSection({ register, errors, watch, setValue }: BankInfoSectionProps) {
  const accountType = watch('bank_info.accountType');

  const accountTypeOptions = [
    { value: 'Cuenta corriente', label: 'Cuenta Corriente' },
    { value: 'Cuenta vista', label: 'Cuenta Vista' },
    { value: 'Cuenta RUT', label: 'Cuenta RUT' }
  ];

  return (
    <div className="bg-white rounded-lg border p-6">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="text-rose-600 font-medium">10</span>
          </div>
          <CardTitle>Información Bancaria</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="space-y-4">
          <Input
            label="Nombre del Titular"
            {...register('bank_info.accountHolder', { required: 'El nombre del titular es requerido' })}
            error={errors.bank_info?.accountHolder?.message}
          />

          <Input
            label="RUT"
            {...register('bank_info.rut', { 
              required: 'El RUT es requerido',
              pattern: {
                value: /^[0-9]{7,8}-[0-9kK]{1}$/,
                message: 'RUT inválido (formato: 12345678-9)'
              }
            })}
            placeholder="12345678-9"
            error={errors.bank_info?.rut?.message}
          />

          <Input
            label="Banco"
            {...register('bank_info.bank', { required: 'El banco es requerido' })}
            error={errors.bank_info?.bank?.message}
          />

          <Select
            label="Tipo de Cuenta"
            {...register('bank_info.accountType', { required: 'El tipo de cuenta es requerido' })}
            options={accountTypeOptions}
            value={accountType}
            onChange={(e) => setValue('bank_info.accountType', e.target.value)}
          />

          <Input
            label="Número de Cuenta"
            {...register('bank_info.accountNumber', { required: 'El número de cuenta es requerido' })}
            error={errors.bank_info?.accountNumber?.message}
          />

          <Input
            label="Correo Electrónico"
            type="email"
            {...register('bank_info.email', {
              required: 'El correo electrónico es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo electrónico inválido'
              }
            })}
            error={errors.bank_info?.email?.message}
            placeholder="Email para recibir comprobantes"
          />
        </div>
      </CardContent>
    </div>
  );
} 