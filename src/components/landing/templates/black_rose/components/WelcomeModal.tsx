import { Button } from '../../../../ui/Button';
import { Music } from 'lucide-react';

interface WelcomeModalProps {
  groomName: string;
  brideName: string;
  onEnterWithMusic: () => void;
  onEnterWithoutMusic: () => void;
}

export function WelcomeModal({
  groomName,
  brideName,
  onEnterWithMusic,
  onEnterWithoutMusic
}: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2B2B]">
      <div className="relative w-full max-w-2xl px-12 py-12 text-center text-[#2D1B69]">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-24 h-24">
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 scale-x-[-1]">
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 scale-y-[-1]">
        </div>
        <div className="absolute bottom-0 right-0 w-24 h-24 scale-[-1]">
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-lg font-lora tracking-[0.2em] uppercase text-[#c1b49a]">
              Bienvenidos a la invitación de
            </p>
            <div className="space-y-4">
              <h1 className="text-7xl font-parisienne text-[#B87600]">
              {groomName} & {brideName}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#B87600]/30"></div>
            <div className="w-2 h-2 rounded-full bg-[#B87600]/30"></div>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#B87600]/30"></div>
          </div>

          <div className="space-y-6">
            <p className="text-lg font-sans text-[#c1b49a]">
              La música de fondo es parte de la experiencia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                onClick={onEnterWithMusic}
                leftIcon={<Music className="h-4 w-4" />}
                className="bg-[#B87600] text-[#012D27] hover:bg-[#2B2B2B] hover:text-white rounded-lg border border-[#B87600] hover:border-[#B87600]"
              >
                Ingresar con música
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onEnterWithoutMusic}
                className="border-[#B87600] text-[#B87600] hover:bg-[#B87600] hover:text-white rounded-lg"
              >
                Ingresar sin música
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}