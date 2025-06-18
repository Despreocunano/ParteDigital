import { CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { LandingPageFormData } from '../../../types/landing';

interface NamesSectionProps {
  register: UseFormRegister<LandingPageFormData>;
  errors: FieldErrors<LandingPageFormData>;
}

export function NamesSection({ register, errors }: NamesSectionProps) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="text-rose-600 font-medium">2</span>
          </div>
          <CardTitle>Nombres</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre del Novio"
            {...register('groom_name', { required: 'El nombre del novio es requerido' })}
            error={errors.groom_name?.message}
          />
          <Input
            label="Nombre de la Novia"
            {...register('bride_name', { required: 'El nombre de la novia es requerido' })}
            error={errors.bride_name?.message}
          />
        </div>
      </CardContent>
    </div>
  );
} 