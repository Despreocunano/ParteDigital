import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { PlacesAutocomplete } from '../../ui/PlacesAutocomplete';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { LandingPageFormData } from '../../../types/landing';
import { Place } from '../../../types/ui';

interface PartySectionProps {
  register: UseFormRegister<LandingPageFormData>;
  errors: FieldErrors<LandingPageFormData>;
  setValue: UseFormSetValue<LandingPageFormData>;
  watch: UseFormWatch<LandingPageFormData>;
}

export function PartySection({ register, errors, setValue, watch }: PartySectionProps) {
  const partyDate = watch('party_date');
  const partyLocation = watch('party_location');
  const partyTime = watch('party_time');
  const partyAddress = watch('party_address');

  return (
    <div className="bg-white rounded-lg border p-6">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="text-rose-600 font-medium">5</span>
          </div>
          <CardTitle>Fiesta</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha"
              type="date"
              {...register('party_date', { required: 'La fecha es requerida' })}
              error={errors.party_date?.message}
              min={new Date().toISOString().split('T')[0]}
            />
            <Input
              label="Hora"
              type="time"
              {...register('party_time', { required: 'La hora es requerida' })}
              error={errors.party_time?.message}
            />
          </div>

          <PlacesAutocomplete
            label="Lugar"
            value={partyLocation}
            onChange={(value) => setValue('party_location', value)}
            onPlaceSelect={(place: Place) => {
              setValue('party_location', place.name);
              setValue('party_address', place.formatted_address);
              setValue('party_place_id', place.place_id);
            }}
            error={errors.party_location?.message}
          />

          <Input
            label="Dirección"
            {...register('party_address', { required: 'La dirección es requerida' })}
            error={errors.party_address?.message}
            value={partyAddress}
            readOnly
          />
        </div>
      </CardContent>
    </div>
  );
} 