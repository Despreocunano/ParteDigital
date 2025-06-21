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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5FEF5]">
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
            <p className="text-sm font-libre tracking-[0.2em] uppercase text-[#404040]">
              Bienvenidos a la invitación de
            </p>
            <div className="space-y-4">
              <h1 className="text-8xl font-abril font-semibold text-[#FABE5A]">
              {groomName} & {brideName}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#CFD6BA]/30"></div>
            <div className="w-2 h-2 rounded-full bg-[#CFD6BA]/30"></div>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#CFD6BA]/30"></div>
          </div>

          <div className="space-y-6">
            <p className="text-lg font-sans text-[#404040]">
              La música de fondo es parte de la experiencia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                onClick={onEnterWithMusic}
                leftIcon={<Music className="h-4 w-4" />}
                className="bg-[#C8A784] hover:bg-[#D0C293] text-[#540B17] rounded-full"
              >
                Ingresar con música
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onEnterWithoutMusic}
                className="text-[#D0C293] hover:bg-[#D0C293] hover:text-[#540B17] rounded-full"
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