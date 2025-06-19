import { CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Textarea } from '../../ui/Textarea';
import { Switch } from '../../ui/Switch';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { LandingPageFormData } from '../../../types/landing';

interface AdditionalInfoSectionProps {
  register: UseFormRegister<LandingPageFormData>;
  errors: FieldErrors<LandingPageFormData>;
  watch: UseFormWatch<LandingPageFormData>;
  setValue: UseFormSetValue<LandingPageFormData>;
}

export function AdditionalInfoSection({ register, errors, watch, setValue }: AdditionalInfoSectionProps) {
  const acceptsKids = watch('accepts_kids');
  const acceptsPets = watch('accepts_pets');

  return (
    <div className="bg-white rounded-lg border p-6">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="text-rose-600 font-medium">9</span>
          </div>
          <CardTitle>Información Adicional</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="space-y-6">
          <Textarea
            label="Información Adicional"
            {...register('additional_info')}
            error={errors.additional_info?.message}
            placeholder="Información adicional que quieras compartir con tus invitados..."
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                ¿Aceptan Niños?
              </label>
              <Switch
                checked={acceptsKids}
                onCheckedChange={(checked) => setValue('accepts_kids', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                ¿Aceptan Mascotas?
              </label>
              <Switch
                checked={acceptsPets}
                onCheckedChange={(checked) => setValue('accepts_pets', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
} 