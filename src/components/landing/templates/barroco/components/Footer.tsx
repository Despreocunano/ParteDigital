import { Heart } from 'lucide-react';
import bottomHero from '../assets/flores_divisor.webp'


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
    <footer className={`relative py-24 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-6 h-6 text-white" />
        </div>
        
        <h2 className="text-4xl md:text-6xl font-fraunces font-extrabold text-white mb-4">
          {groomName} & {brideName}
        </h2>
        
        <p className="text-white text-xl mb-4">
          {new Date(weddingDate).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      <img
            src={bottomHero}
            alt="Decoración inferior"
            className="absolute bottom-0 left-0 w-full object-cover z-10"
          />
    </footer>
  );
}