import { Heart } from 'lucide-react';

interface FooterProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  className?: string;
  textColor?: string;
}

export function Footer({
  groomName,
  brideName,
  weddingDate,
  className = '',
}: FooterProps) {
  return (
    <footer className={`py-24 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-6 h-6 text-white" />
        </div>
        
        <h2 className="text-5xl md:text-6xl font-abril text-white mb-6">
          {groomName} & {brideName}
        </h2>
        
        <p className="text-white text-2xl font-opensans">
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