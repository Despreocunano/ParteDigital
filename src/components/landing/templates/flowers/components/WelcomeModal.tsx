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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDF8F5]">
      <div className="relative w-full max-w-2xl px-8 py-12 text-center text-[#8B4513]">
        {/* Floral corner decorations */}
        <div className="absolute top-0 left-0 w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
            <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
            <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
            <circle cx="30" cy="40" r="4" fill="#D2691E"/>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 rotate-90">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
            <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
            <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
            <circle cx="30" cy="40" r="4" fill="#D2691E"/>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 -rotate-90">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
            <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
            <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
            <circle cx="30" cy="40" r="4" fill="#D2691E"/>
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-24 h-24 rotate-180">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
            <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
            <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
            <circle cx="30" cy="40" r="4" fill="#D2691E"/>
          </svg>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-lg font-light tracking-[0.2em] uppercase">
              Bienvenidos a la invitación de
            </p>
            <div className="space-y-4">
              <h1 className="text-6xl font-serif">
                {groomName.charAt(0)} <span className="font-light text-[#CD853F]">&</span> {brideName.charAt(0)}
              </h1>
              <p className="text-2xl font-serif">
                {groomName} & {brideName}
              </p>
            </div>
          </div>

          <div className="w-px h-12 bg-[#E8A87C]/30 mx-auto"></div>

          <div className="space-y-6">
            <p className="text-lg font-light">
              La música de fondo es parte de la experiencia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                onClick={onEnterWithMusic}
                leftIcon={<Music className="h-4 w-4" />}
                className="bg-[#8B4513] hover:bg-[#A0522D] text-white"
              >
                Ingresar con música
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onEnterWithoutMusic}
                className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
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