import { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Heart } from 'lucide-react';
import { Button } from '../ui/Button';

export function AuthPage() {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setShowLogin(searchParams.get('showLogin') === 'true');
  }, []);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1B69] to-[#E91E63] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => window.location.href = 'https://tuparte.digital'}
          className="absolute top-4 left-4 text-white/90 hover:text-white hover:bg-white/10 rounded-full px-4 transition-all duration-200"
        >
          ← Volver al inicio
        </Button>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-white mx-auto" />
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