import React from 'react';
import { Button } from '../../../../ui/Button';
import { Music } from 'lucide-react';
import cornerSvg from '../assets/corner.svg';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C2127]">
      <div className="relative w-full max-w-3xl px-4 py-16 text-center text-[#D4B572]">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-[160px] h-[160px] -translate-x-4 -translate-y-4">
          <img src={cornerSvg} alt="" className="w-full h-full text-[#D4B572]/30" />
        </div>
        <div className="absolute top-0 right-0 w-[160px] h-[160px] translate-x-4 -translate-y-4 rotate-90">
          <img src={cornerSvg} alt="" className="w-full h-full text-[#D4B572]/30" />
        </div>
        <div className="absolute bottom-0 left-0 w-[160px] h-[160px] -translate-x-4 translate-y-4 -rotate-90">
          <img src={cornerSvg} alt="" className="w-full h-full text-[#D4B572]/30" />
        </div>
        <div className="absolute bottom-0 right-0 w-[160px] h-[160px] translate-x-4 translate-y-4 rotate-180">
          <img src={cornerSvg} alt="" className="w-full h-full text-[#D4B572]/30" />
        </div>

        {/* Content */}
        <div className="space-y-10 px-2">
          <div className="space-y-6">
            <p className="text-xl font-light tracking-[0.2em] uppercase">
              Bienvenidos a la invitación de
            </p>
            <div className="space-y-4">
              <h1 className="text-7xl md:text-8xl font-serif">
                {groomName.charAt(0)} <span className="font-light text-6xl md:text-7xl">&</span> {brideName.charAt(0)}
              </h1>
              <p className="text-3xl md:text-4xl font-serif">
                {groomName} & {brideName}
              </p>
            </div>
          </div>

          <div className="w-px h-16 bg-[#D4B572]/30 mx-auto"></div>

          <div className="space-y-8">
            <p className="text-xl font-light">
              La música de fondo es parte de la experiencia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                onClick={onEnterWithMusic}
                className="bg-[#D4B572] hover:bg-[#C4A562] text-[#1C2127] px-8 py-4 text-lg rounded-none"
              >
                <Music className="w-5 h-5 mr-2" />
                Ingresar con música
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onEnterWithoutMusic}
                className="border-[#D4B572] text-[#D4B572] hover:bg-[#D4B572]/10 px-8 py-4 text-lg rounded-none"
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