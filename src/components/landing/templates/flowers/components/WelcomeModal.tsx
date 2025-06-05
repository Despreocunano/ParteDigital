import React from 'react';
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
      <div className="relative w-full max-w-2xl px-8 py-12 text-center text-[#B76E79]">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#B76E79]/30"></div>
        <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-[#B76E79]/30"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-[#B76E79]/30"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-[#B76E79]/30"></div>

        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-lg font-light tracking-[0.2em] uppercase">
              Bienvenidos a la invitación de
            </p>
            <div className="space-y-4">
              <h1 className="text-6xl font-serif">
                {groomName.charAt(0)} <span className="font-light">&</span> {brideName.charAt(0)}
              </h1>
              <p className="text-2xl font-serif">
                {groomName} & {brideName}
              </p>
            </div>
          </div>

          <div className="w-px h-12 bg-[#B76E79]/30 mx-auto"></div>

          <div className="space-y-6">
            <p className="text-lg font-light">
              La música de fondo es parte de la experiencia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                onClick={onEnterWithMusic}
                className="bg-[#B76E79] hover:bg-[#A65D68] text-white px-8 py-3 rounded-none"
              >
                <Music className="w-4 h-4 mr-2" />
                Ingresar con música
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onEnterWithoutMusic}
                className="border-[#B76E79] text-[#B76E79] hover:bg-[#B76E79]/10 px-8 py-3 rounded-none"
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