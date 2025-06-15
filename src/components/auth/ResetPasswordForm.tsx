import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

export function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw error;
      }

      toast.success('Contraseña actualizada correctamente');
      setTimeout(() => {
        window.location.href = 'https://panel.tuparte.digital/auth?showLogin=true';
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      toast.error('Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-center mb-2">Nueva Contraseña</h2>
        <p className="text-xs text-gray-500 text-center mb-6">
          Ingresa tu nueva contraseña
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Input
              type="password"
              placeholder="Nueva contraseña"
              error={errors.password?.message}
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              })}
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirmar contraseña"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Por favor confirma tu contraseña',
                validate: (value) =>
                  value === password || 'Las contraseñas no coinciden',
              })}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-9 bg-primary text-primary-contrast hover:bg-primary-dark"
            isLoading={loading}
          >
            Actualizar Contraseña
          </Button>
        </form>
      </div>
    </Card>
  );
} 