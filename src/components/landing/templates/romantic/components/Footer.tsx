import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  className?: string;
}

export function Footer({
  groomName,
  brideName,
  weddingDate,
  className = ''
}: FooterProps) {
  return (
    <footer className={`py-24 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-12 h-12 bg-[#D4B572]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-6 h-6 text-[#D4B572]" />
        </div>
        
        <h2 className="text-3xl font-serif mb-4 text-[#D4B572]">
          {groomName} & {brideName}
        </h2>
        
        <p className="text-[#D4B572]/80">
          {new Date(weddingDate).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </footer>
  );
}