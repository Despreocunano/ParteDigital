import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Switch } from '../ui/Switch';
import type { Attendee, RsvpStatus } from '../../types/supabase';

interface AttendeeFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
  attendee?: Attendee;
}

export function AttendeeForm({ onSubmit, onCancel, isLoading, attendee }: AttendeeFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      first_name: attendee?.first_name || '',
      email: attendee?.email || '',
      phone: attendee?.phone || '',
      rsvp_status: attendee?.rsvp_status || 'pending',
      dietary_restrictions: attendee?.dietary_restrictions || '',
      has_plus_one: attendee?.has_plus_one || false,
      plus_one_name: attendee?.plus_one_name || '',
      plus_one_dietary_restrictions: attendee?.plus_one_dietary_restrictions || '',
      plus_one_rsvp_status: attendee?.plus_one_rsvp_status || 'pending'
    }
  });

  const hasPlusOne = watch('has_plus_one');
  const rsvpStatus = watch('rsvp_status') as RsvpStatus;

  // El acompañante siempre debe tener el mismo estado que el invitado principal
  React.useEffect(() => {
    if (hasPlusOne) {
      setValue('plus_one_rsvp_status', rsvpStatus);
    }
  }, [rsvpStatus, hasPlusOne, setValue]);

  // Handle clearing plus one fields when toggling has_plus_one
  React.useEffect(() => {
    if (!hasPlusOne) {
      setValue('plus_one_name', '');
      setValue('plus_one_dietary_restrictions', '');
      setValue('plus_one_rsvp_status', 'pending');
    } else {
      setValue('plus_one_rsvp_status', rsvpStatus);
    }
  }, [hasPlusOne, setValue, rsvpStatus]);

  const handleFormSubmit = (data: any) => {
    // Format the data before submitting
    const formattedData = {
      ...data,
      // Si tiene acompañante, asegurar que tenga el mismo estado
      ...(data.has_plus_one && {
        plus_one_rsvp_status: data.rsvp_status
      }),
      // Si no tiene acompañante o el invitado principal rechaza, limpiar campos del acompañante
      ...((!data.has_plus_one || data.rsvp_status === 'declined') && {
        plus_one_name: null,
        plus_one_dietary_restrictions: null,
        plus_one_rsvp_status: null
      })
    };

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Nombre"
            {...register('first_name', { 
              required: 'El nombre es requerido' 
            })}
            error={errors.first_name?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Input
            label="Teléfono"
            {...register('phone')}
            error={errors.phone?.message}
          />
        </div>

        <Select
          label="Estado de Confirmación"
          {...register('rsvp_status')}
          options={[
            { value: 'pending', label: 'Pendiente' },
            { value: 'confirmed', label: 'Confirmado' },
            { value: 'declined', label: 'No Asistirá' }
          ]}
        />

        {rsvpStatus !== 'declined' && (
          <Textarea
            label="Restricciones Alimentarias"
            placeholder="Ingrese cualquier restricción alimentaria o alergia"
            {...register('dietary_restrictions')}
          />
        )}

        <div className="space-y-4 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              ¿Viene con Acompañante?
            </label>
            <Switch
              checked={hasPlusOne}
              onCheckedChange={(checked) => {
                setValue('has_plus_one', checked);
                if (!checked) {
                  setValue('plus_one_name', '');
                  setValue('plus_one_dietary_restrictions', '');
                  setValue('plus_one_rsvp_status', 'pending');
                } else {
                  setValue('plus_one_rsvp_status', rsvpStatus);
                }
              }}
            />
          </div>

          {hasPlusOne && rsvpStatus !== 'declined' && (
            <div className="space-y-4">
              <Input
                label="Nombre del Acompañante"
                {...register('plus_one_name', {
                  required: hasPlusOne ? 'El nombre del acompañante es requerido' : false
                })}
                error={errors.plus_one_name?.message}
              />

              {watch('plus_one_rsvp_status') !== 'declined' && (
                <Textarea
                  label="Restricciones Alimentarias del Acompañante"
                  placeholder="Ingrese cualquier restricción alimentaria o alergia del acompañante"
                  {...register('plus_one_dietary_restrictions')}
                />
              )}
            </div>
          )}
        </div>
      </div>

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
        <Button
          type="submit"
          isLoading={isLoading}
          className='bg-primary hover:bg-primary-dark text-primary-contrast'
        >
          {attendee ? 'Guardar Cambios' : 'Agregar Asistente'}
        </Button>
      </div>
    </form>
  );
}