import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Switch } from '../ui/Switch';
import { toast } from 'react-hot-toast';

interface ThemeStyles {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  inputBackground?: string;
  placeholderColor?: string;
  accentColor?: string;
  successBackground?: string;
  successText?: string;
  errorBackground?: string;
  errorText?: string;
}

interface RsvpFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  dietary_restrictions?: string;
  has_plus_one: boolean;
  plus_one_name?: string;
  plus_one_dietary_restrictions?: string;
}

interface PublicRsvpFormProps {
  userId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  theme?: ThemeStyles;
}

export function PublicRsvpForm({ 
  userId, 
  onSuccess, 
  onError,
  theme = {
    backgroundColor: '#1C2127',
    textColor: '#D4B572',
    borderColor: '#D4B572',
    inputBackground: '#1C2127',
    placeholderColor: '#D4B572',
    accentColor: '#C4A562',
    successBackground: '#1C2127',
    successText: '#D4B572',
    errorBackground: 'rgba(220, 38, 38, 0.2)',
    errorText: '#ef4444'
  }
}: PublicRsvpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RsvpFormData>({
    defaultValues: {
      has_plus_one: false
    }
  });

  const hasPlusOne = watch('has_plus_one');

  const onSubmit = async (data: RsvpFormData) => {
    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const { data: attendee, error: attendeeError } = await supabase
        .from('attendees')
        .insert([
          {
            user_id: userId,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone || null,
            rsvp_status: 'confirmed',
            dietary_restrictions: data.dietary_restrictions || null,
            has_plus_one: data.has_plus_one,
            plus_one_name: data.has_plus_one ? data.plus_one_name : null,
            plus_one_dietary_restrictions: data.has_plus_one ? data.plus_one_dietary_restrictions : null,
            plus_one_rsvp_status: data.has_plus_one ? 'confirmed' : null
          }
        ])
        .select()
        .single();

      if (attendeeError) throw attendeeError;

      setSubmitStatus('success');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setSubmitStatus('error');
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyles = () => ({
    className: `bg-[${theme.inputBackground}] border-[${theme.borderColor}]/20 text-[${theme.textColor}] placeholder-[${theme.textColor}]/60`,
    hideLabel: true
  });

  if (submitStatus === 'success') {
    return (
      <div className="text-center">
        <h3 className={`text-2xl font-serif text-[${theme.successText}] mb-4`}>¡Gracias por confirmar!</h3>
        <p className={`text-[${theme.successText}]/80`}>Hemos recibido tu confirmación de asistencia.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitStatus === 'error' && (
        <div className={`bg-[${theme.errorBackground}] border border-[${theme.errorText}]/20 text-[${theme.errorText}] px-4 py-3 rounded-md`}>
          Ha ocurrido un error. Por favor, intenta nuevamente.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Nombre"
          {...register('first_name', { 
            required: 'El nombre es requerido' 
          })}
          error={errors.first_name?.message}
          {...getInputStyles()}
        />
        <Input
          placeholder="Apellido"
          {...register('last_name', { 
            required: 'El apellido es requerido' 
          })}
          error={errors.last_name?.message}
          {...getInputStyles()}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Correo Electrónico"
          type="email"
          {...register('email', {
            required: 'El correo electrónico es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Correo electrónico inválido'
            }
          })}
          error={errors.email?.message}
          {...getInputStyles()}
        />
        <Input
          placeholder="Teléfono"
          {...register('phone')}
          error={errors.phone?.message}
          {...getInputStyles()}
        />
      </div>

      <Input
        placeholder="¿Tienes alguna alergia?"
        {...register('dietary_restrictions')}
        {...getInputStyles()}
      />

      <div className={`space-y-4 border-t border-[${theme.borderColor}]/20 pt-4`}>
        <div className="flex items-center justify-between">
          <label className={`text-sm font-medium text-[${theme.textColor}]`}>
            ¿Vienes con Acompañante?
          </label>
          <Switch
            checked={hasPlusOne}
            onCheckedChange={(checked) => setValue('has_plus_one', checked)}
          />
        </div>

        {hasPlusOne && (
          <div className="space-y-4">
            <Input
              placeholder="Nombre del Acompañante"
              {...register('plus_one_name', {
                required: hasPlusOne ? 'El nombre del acompañante es requerido' : false
              })}
              error={errors.plus_one_name?.message}
              {...getInputStyles()}
            />

            <Input
              placeholder="¿Tu acompañante tiene alguna alergia?"
              {...register('plus_one_dietary_restrictions')}
              {...getInputStyles()}
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        className={`w-full bg-[${theme.textColor}] hover:bg-[${theme.accentColor}] text-[${theme.backgroundColor}] px-8 py-3`}
        isLoading={isLoading}
      >
        Confirmar Asistencia
      </Button>
    </form>
  );
}