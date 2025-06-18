import { CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { LandingPageFormData } from '../../../types/landing';

interface GiftSectionProps {
  register: UseFormRegister<LandingPageFormData>;
  errors: FieldErrors<LandingPageFormData>;
  watch: UseFormWatch<LandingPageFormData>;
}

export function GiftSection({ register, errors, watch }: GiftSectionProps) {
  const coupleCode = watch('couple_code');

  const storeOptions = [
    { value: 'falabella', label: 'Falabella' },
    { value: 'paris', label: 'Paris' }
  ];

  return (
    <div className="bg-white rounded-lg border p-6">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="text-rose-600 font-medium">7</span>
          </div>
          <CardTitle>Regalo</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="space-y-4">
          <Input
            label="Código de Novios"
            {...register('couple_code')}
            error={errors.couple_code?.message}
            placeholder="Ingresa el código de novios"
          />
          <Select
            label="Tienda"
            {...register('store')}
            options={storeOptions}
            disabled={!coupleCode}
          />
          {!coupleCode && (
            <p className="text-sm text-gray-500">
              Ingresa un código de novios para seleccionar la tienda
            </p>
          )}
        </div>
      </CardContent>
    </div>
  );
} 