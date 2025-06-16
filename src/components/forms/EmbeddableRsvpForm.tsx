import React from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Switch } from '../ui/Switch';

interface RsvpFormData {
  full_name: string;
  email: string;
  phone?: string;
  dietary_restrictions?: string;
  has_plus_one: boolean;
  plus_one_name?: string;
  plus_one_dietary_restrictions?: string;
}

interface EmbeddableRsvpFormProps {
  userId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function EmbeddableRsvpForm({ userId, onSuccess, onError }: EmbeddableRsvpFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const { register, handleSubmit, watch, setValue, setError, getValues, formState: { errors } } = useForm<RsvpFormData>({
    defaultValues: {
      has_plus_one: false
    }
  });

  const hasPlusOne = watch('has_plus_one');

  const onSubmit = async (formData: RsvpFormData) => {
    if (!formData.full_name) {
      setError('full_name', { type: 'required', message: 'El nombre completo es requerido' });
      return;
    }

    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('attendees')
        .insert([
          {
            user_id: userId,
            first_name: formData.full_name,
            last_name: '',
            email: formData.email || null,
            phone: formData.phone || null,
            dietary_restrictions: formData.dietary_restrictions || null,
            rsvp_status: 'confirmed',
            has_plus_one: formData.has_plus_one || false,
            plus_one_name: formData.plus_one_name || null,
            plus_one_dietary_restrictions: formData.plus_one_dietary_restrictions || null
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setTimeout(() => {
        onSuccess?.();
      }, 3000);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setSubmitStatus('error');
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const onReject = async () => {
    const formData = getValues();
    if (!formData.full_name) {
      setError('full_name', { type: 'required', message: 'El nombre completo es requerido' });
      return;
    }

    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('attendees')
        .insert([
          {
            user_id: userId,
            first_name: formData.full_name,
            last_name: '',
            email: formData.email || null,
            phone: formData.phone || null,
            rsvp_status: 'declined'
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setTimeout(() => {
        onSuccess?.();
      }, 3000);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setSubmitStatus('error');
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-serif text-gray-800 mb-2">¡Gracias por tu respuesta!</h3>
        <p className="text-gray-600 text-sm font-serif mb-3">Hemos registrado tu respuesta.</p>
        <p className="text-xs text-gray-500 font-serif">El modal se cerrará en unos segundos...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <div>
        <input
          {...register('full_name', { required: 'El nombre completo es requerido' })}
          placeholder="Nombre completo *"
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent text-sm text-gray-700 placeholder-gray-400 font-serif"
        />
        {errors.full_name && (
          <p className="mt-1 text-xs text-red-500 font-serif">{errors.full_name.message}</p>
        )}
      </div>

      <div>
        <input
          {...register('email', {
            required: 'El correo electrónico es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Correo electrónico inválido'
            }
          })}
          placeholder="Correo Electrónico *"
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent text-sm text-gray-700 placeholder-gray-400 font-serif"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500 font-serif">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          {...register('phone')}
          placeholder="Teléfono (opcional)"
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent text-sm text-gray-700 placeholder-gray-400 font-serif"
        />
      </div>

      <div>
        <textarea
          {...register('dietary_restrictions')}
          placeholder="Restricciones alimentarias (opcional)"
          rows={2}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent text-sm text-gray-700 placeholder-gray-400 resize-none font-serif"
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-700 font-serif">¿Vienes con Acompañante?</span>
        <Switch
          checked={watch('has_plus_one')}
          onCheckedChange={(checked) => setValue('has_plus_one', checked)}
          className="data-[state=checked]:bg-gray-600"
        />
      </div>

      {watch('has_plus_one') && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-md">
          <div>
            <input
              {...register('plus_one_name', { required: 'El nombre del acompañante es requerido' })}
              placeholder="Nombre del Acompañante *"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent text-sm text-gray-700 placeholder-gray-400 font-serif"
            />
            {errors.plus_one_name && (
              <p className="mt-1 text-xs text-red-500 font-serif">{errors.plus_one_name.message}</p>
            )}
          </div>

          <div>
            <textarea
              {...register('plus_one_dietary_restrictions')}
              placeholder="Restricciones alimentarias del acompañante (opcional)"
              rows={2}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent text-sm text-gray-700 placeholder-gray-400 resize-none font-serif"
            />
          </div>
        </div>
      )}

      <div className="pt-2 space-y-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed font-serif"
        >
          {isLoading ? 'Confirmando...' : 'Confirmar Asistencia'}
        </button>
        <button
          type="button"
          onClick={onReject}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed font-serif"
        >
          {isLoading ? 'Enviando...' : 'No podré asistir'}
        </button>
      </div>

      {submitStatus === 'error' && (
        <p className="text-xs text-red-500 text-center font-serif">
          Hubo un error al enviar tu respuesta. Por favor, intenta nuevamente.
        </p>
      )}
    </form>
  );
}