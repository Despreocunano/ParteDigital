import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface FeatureLockModalProps {
  title: string;
  description: string;
  actionText: string;
  actionPath: string;
  isOpen: boolean;
  onClose?: () => void;
}

export function FeatureLockModal({
  title,
  description,
  actionText,
  actionPath,
  isOpen,
  onClose
}: FeatureLockModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      {/* Contenido del modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-rose-50 p-3 rounded-full">
              <Lock className="h-6 w-6 text-rose-500" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900">
              {title}
            </h2>
            
            <p className="text-gray-500">
              {description}
            </p>

            <div className="flex gap-3 w-full">
              {onClose && (
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cerrar
                </Button>
              )}
              <Button
                onClick={() => navigate(actionPath)}
                className="flex-1"
              >
                {actionText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 