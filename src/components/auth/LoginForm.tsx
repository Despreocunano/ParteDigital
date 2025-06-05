import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';

type FormData = {
  email: string;
  password: string;
};

interface LoginFormProps {
  onToggleForm: () => void;
}

export function LoginForm({ onToggleForm }: LoginFormProps) {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const { success, error } = await signIn(data.email, data.password);
      
      if (success) {
        navigate('/', { replace: true });
      } else if (error) {
        setErrorMessage(error.message);
      }
    } catch (error) {
      setErrorMessage('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-gray-900">
          Bienvenido de nuevo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@ejemplo.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'El correo electrónico es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo electrónico inválido',
              },
            })}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'La contraseña es requerida',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres',
              },
            })}
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Iniciar sesión
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onToggleForm}
            className="text-rose-600 hover:text-rose-800 font-medium"
          >
            Regístrate
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}