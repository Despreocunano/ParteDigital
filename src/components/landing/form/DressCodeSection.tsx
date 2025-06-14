import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { LandingPageFormData } from '../../../types/landing';

interface DressCodeSectionProps {
  register: UseFormRegister<LandingPageFormData>;
  errors: FieldErrors<LandingPageFormData>;
  setValue: UseFormSetValue<LandingPageFormData>;
  watch: UseFormWatch<LandingPageFormData>;
}

export function DressCodeSection({ register, errors, setValue, watch }: DressCodeSectionProps) {
  const dressCode = watch('dress_code');
  const showCustomDressCode = dressCode === 'custom';

  const dressCodeOptions = [
    { value: 'formal', label: 'Formal' },
    { value: 'black_tie', label: 'Black Tie' },
    { value: 'cocktail', label: 'Cocktail' },
    { value: 'semi_formal', label: 'Semi Formal' },
    { value: 'casual_elegante', label: 'Casual Elegante' },
    { value: 'custom', label: 'Otro' }
  ];

  return (
    <div className="bg-white rounded-lg border p-6">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="text-rose-600 font-medium">6</span>
          </div>
          <CardTitle>Código de Vestimenta</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="space-y-4">
          <Select
            label="Código de Vestimenta"
            {...register('dress_code')}
            options={dressCodeOptions}
            value={dressCode}
            onChange={(e) => setValue('dress_code', e.target.value)}
          />
          {showCustomDressCode && (
            <Input
              label="Especificar Código de Vestimenta"
              {...register('dress_code', { required: 'El código de vestimenta es requerido' })}
              error={errors.dress_code?.message}
              placeholder="Ej: Casual, Deportivo, etc."
            />
          )}
        </div>
      </CardContent>
    </div>
  );
} 