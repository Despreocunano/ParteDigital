import { Save } from 'lucide-react';

interface FloatingSaveButtonProps {
  isLoading: boolean;
}

export function FloatingSaveButton({ isLoading }: FloatingSaveButtonProps) {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="submit"
      className="fixed bottom-6 right-6 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg p-4 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed z-50"
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
      ) : (
        <>
          <Save className="h-5 w-5" />
          <span className="font-medium">Guardar cambios</span>
        </>
      )}
    </button>
  );
}