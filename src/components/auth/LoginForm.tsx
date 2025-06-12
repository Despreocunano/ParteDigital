import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Mail, Lock } from 'lucide-react';

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
        window.scrollTo(0, 0);
        navigate('/', { replace: true });
      } else if (error) {
        setErrorMessage(error.message);
      }
    } catch (error: any) {
      setErrorMessage('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold text-gray-900">
          Bienvenido de nuevo
        </CardTitle>
        <p className="text-center text-sm text-gray-500">
          Ingresa tus credenciales para acceder a tu panel
        </p>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@ejemplo.com"
            error={errors.email?.message}
              leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
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
              leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
            {...register('password', {
              required: 'La contraseña es requerida',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres',
              },
            })}
          />
          </div>
          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full bg-rose-500 hover:bg-rose-600 text-white h-11"
          >
            Iniciar sesión
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onToggleForm}
            className="text-rose-600 hover:text-rose-800 font-medium transition-colors"
          >
            Regístrate
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}