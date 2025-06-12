import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Heart } from 'lucide-react';
import { Button } from '../ui/Button';

export function AuthPage() {
  const [showLogin, setShowLogin] = useState(false);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1B69] to-[#E91E63] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => window.location.href = 'https://tuparte.digital'}
          className="absolute top-4 left-4 text-white hover:text-white/80"
        >
          ← Volver al inicio
        </Button>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              {showLogin ? 'Bienvenido de nuevo' : 'Crear cuenta'}
            </h1>
            <p className="text-white/80">
              {showLogin 
                ? 'Ingresa tus datos para continuar' 
                : 'Completa el formulario para registrarte'}
            </p>
          </div>

          {showLogin ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <RegisterForm onToggleForm={toggleForm} />
          )}
        </div>
      </div>
    </div>
  );
}