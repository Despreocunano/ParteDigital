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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07212B]">
      <div className="relative w-full max-w-4xl px-12 py-12 text-center text-white">

        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-4">

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-fraunces font-light text-[#C8A784]">
              Bienvenidos a la invitación de {groomName} & {brideName}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-white/30"></div>
          </div>

          <div className="space-y-6">
            <p className="text-2xl font-surana font-light">
              La música de fondo es parte de la experiencia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                onClick={onEnterWithMusic}
                leftIcon={<Music className="h-4 w-4" />}
                className="bg-[#c8a784] hover:bg-[#c6c6c5] text-white hover:text-[#333]"
              >
                Ingresar con música
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onEnterWithoutMusic}
                className="border-[#c8a784] text-[#c8a784] hover:bg-[#c8a784] hover:text-white"
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