import { CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { PlacesAutocomplete } from '../../ui/PlacesAutocomplete';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { LandingPageFormData } from '../../../types/landing';
import { Place } from '../../../types/ui';

interface CeremonySectionProps {
  register: UseFormRegister<LandingPageFormData>;
  errors: FieldErrors<LandingPageFormData>;
  setValue: UseFormSetValue<LandingPageFormData>;
  watch: UseFormWatch<LandingPageFormData>;
}

export function CeremonySection({ register, errors, setValue, watch }: CeremonySectionProps) {
  const ceremonyDate = watch('ceremony_date');
  const ceremonyLocation = watch('ceremony_location');
  const ceremonyTime = watch('ceremony_time');
  const ceremonyAddress = watch('ceremony_address');

  return (
    <div className="bg-white rounded-lg border p-6">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="text-rose-600 font-medium">4</span>
          </div>
          <CardTitle>Ceremonia</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha"
              type="date"
              {...register('ceremony_date', { required: 'La fecha es requerida' })}
              error={errors.ceremony_date?.message}
              min={new Date().toISOString().split('T')[0]}
            />
            <Input
              label="Hora"
              type="time"
              {...register('ceremony_time', { required: 'La hora es requerida' })}
              error={errors.ceremony_time?.message}
            />
          </div>

          <PlacesAutocomplete
            label="Lugar"
            value={ceremonyLocation}
            onChange={(address, placeId) => {
              setValue('ceremony_location', address);
              setValue('ceremony_address', address);
              setValue('ceremony_place_id', placeId);
            }}
            error={errors.ceremony_location?.message}
          />

          <Input
            label="Dirección"
            {...register('ceremony_address', { required: 'La dirección es requerida' })}
            error={errors.ceremony_address?.message}
            value={ceremonyAddress}
            readOnly
          />
        </div>
      </CardContent>
    </div>
  );
} 