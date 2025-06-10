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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FCE4EC]">
      <div className="relative w-full max-w-2xl px-8 py-12 text-center text-[#2D1B69]">
        {/* Cherry blossom corner decorations */}
        <div className="absolute top-0 left-0 w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M10 90 Q30 70, 50 50 Q70 30, 90 10" stroke="#E91E63" strokeWidth="2" fill="none" opacity="0.3"/>
            <circle cx="25" cy="75" r="4" fill="#F8BBD9" opacity="0.6"/>
            <circle cx="50" cy="50" r="5" fill="#F8BBD9" opacity="0.6"/>
            <circle cx="75" cy="25" r="3" fill="#FCE4EC"/>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 scale-x-[-1]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M10 90 Q30 70, 50 50 Q70 30, 90 10" stroke="#E91E63" strokeWidth="2" fill="none" opacity="0.3"/>
            <circle cx="25" cy="75" r="4" fill="#F8BBD9" opacity="0.6"/>
            <circle cx="50" cy="50" r="5" fill="#F8BBD9" opacity="0.6"/>
            <circle cx="75" cy="25" r="3" fill="#FCE4EC"/>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 scale-y-[-1]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M10 90 Q30 70, 50 50 Q70 30, 90 10" stroke="#E91E63" strokeWidth="2" fill="none" opacity="0.3"/>
            <circle cx="25" cy="75" r="4" fill="#F8BBD9" opacity="0.6"/>
            <circle cx="50" cy="50" r="5" fill="#F8BBD9" opacity="0.6"/>
            <circle cx="75" cy="25" r="3" fill="#FCE4EC"/>
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-24 h-24 scale-[-1]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M10 90 Q30 70, 50 50 Q70 30, 90 10" stroke="#E91E63" strokeWidth="2" fill="none" opacity="0.3"/>
            <circle cx="25" cy="75" r="4" fill="#F8BBD9" opacity="0.6"/>
            <circle cx="50" cy="50" r="5" fill="#F8BBD9" opacity="0.6"/>
            <circle cx="75" cy="25" r="3" fill="#FCE4EC"/>
          </svg>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-lg font-light tracking-[0.2em] uppercase text-[#8D6E63]">
              Bienvenidos a la invitación de
            </p>
            <div className="space-y-4">
              <h1 className="text-6xl font-serif">
                {groomName.charAt(0)} <span className="font-light text-[#E91E63]">&</span> {brideName.charAt(0)}
              </h1>
              <p className="text-2xl font-serif">
                {groomName} & {brideName}
              </p>
            </div>
          </div>

          <div className="w-px h-12 bg-[#F8BBD9]/50 mx-auto"></div>

          <div className="space-y-6">
            <p className="text-lg font-light">
              La música de fondo es parte de la experiencia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                onClick={onEnterWithMusic}
                leftIcon={<Music className="h-4 w-4" />}
                className="bg-[#E91E63] hover:bg-[#C2185B] text-white"
              >
                Ingresar con música
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onEnterWithoutMusic}
                className="border-[#E91E63] text-[#E91E63] hover:bg-[#E91E63] hover:text-white"
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