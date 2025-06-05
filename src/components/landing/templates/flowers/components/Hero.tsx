import React from 'react';

interface HeroProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  welcomeMessage?: string;
  backgroundImage?: string;
  className?: string;
}

export function Hero({
  groomName,
  brideName,
  weddingDate,
  welcomeMessage,
  backgroundImage = 'https://images.pexels.com/photos/931158/pexels-photo-931158.jpeg',
  className = ''
}: HeroProps) {
  return (
    <section className={`relative min-h-screen ${className}`}>
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>
        </div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block">
            <div className="relative px-16 py-12">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/40"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-white/40"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-white/40"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white/40"></div>

              <div className="space-y-6">
                <p className="text-white/90 text-lg tracking-[0.2em] uppercase">
                  {new Date(weddingDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>

                <h1 className="text-6xl md:text-7xl lg:text-8xl text-white font-serif">
                  {groomName} <br />
                  <span className="font-light text-white/80">&</span> <br />
                  {brideName}
                </h1>

                {welcomeMessage && (
                  <>
                    <div className="w-16 h-px bg-white/40 mx-auto"></div>
                    <p className="text-white/80 text-xl font-light italic">
                      {welcomeMessage}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}