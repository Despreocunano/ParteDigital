import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { LandingPageFormData } from '../../../types/landing';

interface WelcomeMessageSectionProps {
  register: UseFormRegister<LandingPageFormData>;
  errors: FieldErrors<LandingPageFormData>;
  watch: UseFormWatch<LandingPageFormData>;
}

export function WelcomeMessageSection({ register, errors, watch }: WelcomeMessageSectionProps) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="text-rose-600 font-medium">3</span>
          </div>
          <CardTitle>Mensaje de Bienvenida</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="space-y-4">
          <Textarea
            label="Mensaje de Bienvenida"
            {...register('welcome_message', {
              maxLength: {
                value: 120,
                message: 'El mensaje no puede tener más de 120 caracteres'
              }
            })}
            error={errors.welcome_message?.message}
            placeholder="Escribe un mensaje de bienvenida para tus invitados..."
            maxLength={120}
          />
          <div className="text-sm text-gray-500 text-right">
            {watch('welcome_message')?.length || 0}/120 caracteres
          </div>
          <Input
            label="Hashtag"
            {...register('hashtag')}
            error={errors.hashtag?.message}
            placeholder="Ej: JuanYMaria2024"
          />
        </div>
      </CardContent>
    </div>
  );
} 