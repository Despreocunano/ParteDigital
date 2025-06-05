import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Switch } from '../ui/Switch';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface RsvpFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  dietary_restrictions?: string;
  has_plus_one: boolean;
  plus_one_name?: string;
  plus_one_dietary_restrictions?: string;
  songs: Array<{
    name: string;
    artist: string;
  }>;
}

interface PublicRsvpFormProps {
  userId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  showSongRecommendations?: boolean;
}

export function PublicRsvpForm({ 
  userId, 
  onSuccess, 
  onError,
  showSongRecommendations = false
}: PublicRsvpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RsvpFormData>({
    defaultValues: {
      has_plus_one: false,
      songs: []
    }
  });

  const hasPlusOne = watch('has_plus_one');
  const songs = watch('songs');

  const addSong = () => {
    if (songs.length >= 2) return;
    setValue('songs', [...songs, { name: '', artist: '' }]);
  };

  const removeSong = (index: number) => {
    setValue('songs', songs.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: RsvpFormData) => {
    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      // First create the attendee
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

      // Then add song recommendations if enabled
      if (showSongRecommendations && data.songs.length > 0) {
        const { error: songsError } = await supabase
          .from('song_recommendations')
          .insert(
            data.songs.map(song => ({
              attendee_id: attendee.id,
              song_name: song.name,
              artist_name: song.artist
            }))
          );

        if (songsError) throw songsError;
      }

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

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Gracias por confirmar!</h3>
        <p className="text-gray-600">Hemos recibido tu confirmación de asistencia.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          Ha ocurrido un error. Por favor, intenta nuevamente.
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            {...register('first_name', { 
              required: 'El nombre es requerido' 
            })}
            error={errors.first_name?.message}
          />
          <Input
            label="Apellido"
            {...register('last_name', { 
              required: 'El apellido es requerido' 
            })}
            error={errors.last_name?.message}
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

        <Textarea
          label="Restricciones Alimentarias"
          placeholder="¿Tienes alguna restricción alimentaria o alergia?"
          {...register('dietary_restrictions')}
        />

        <div className="space-y-4 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
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
                label="Nombre del Acompañante"
                {...register('plus_one_name', {
                  required: hasPlusOne ? 'El nombre del acompañante es requerido' : false
                })}
                error={errors.plus_one_name?.message}
              />

              <Textarea
                label="Restricciones Alimentarias del Acompañante"
                placeholder="¿Tu acompañante tiene alguna restricción alimentaria o alergia?"
                {...register('plus_one_dietary_restrictions')}
              />
            </div>
          )}
        </div>

        {showSongRecommendations && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Recomienda Canciones</h3>
                <p className="text-sm text-gray-500">Sugiere hasta 2 canciones para la fiesta</p>
              </div>
              {songs.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSong}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Agregar Canción
                </Button>
              )}
            </div>

            {songs.map((_, index) => (
              <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-700">Canción {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSong(index)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre de la Canción"
                    {...register(`songs.${index}.name` as const, {
                      required: 'El nombre de la canción es requerido'
                    })}
                  />
                  <Input
                    label="Artista"
                    {...register(`songs.${index}.artist` as const, {
                      required: 'El nombre del artista es requerido'
                    })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
      >
        Confirmar Asistencia
      </Button>
    </form>
  );
}