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
  backgroundImage = 'https://images.pexels.com/photos/1589820/pexels-photo-1589820.jpeg',
  className = ''
}: HeroProps) {
  const formattedDate = new Date(weddingDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  return (
    <section className={`relative min-h-screen ${className}`}>
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left side - Sticky Image */}
          <div className="relative hidden lg:block">
            <div className="sticky top-0 h-screen">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex items-center justify-center p-8 lg:p-16">
            <div className="relative text-center text-[#D4B572] max-w-lg mx-auto">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-[#D4B572]/30"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-[#D4B572]/30"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-[#D4B572]/30"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#D4B572]/30"></div>

              {/* Content */}
              <div className="py-12 px-6">
                <p className="text-lg mb-6 font-light tracking-[0.2em] uppercase">
                  {formattedDate}
                </p>
                
                <div className="space-y-4 mb-8">
                  <h1 className="text-6xl font-serif">
                    {groomName.charAt(0)} <span className="font-light">&</span> {brideName.charAt(0)}
                  </h1>
                  <p className="text-2xl font-serif">
                    {groomName} & {brideName}
                  </p>
                </div>

                <div className="w-px h-12 bg-[#D4B572]/30 mx-auto mb-8"></div>

                {welcomeMessage ? (
                  <p className="text-lg font-light leading-relaxed">
                    {welcomeMessage}
                  </p>
                ) : (
                  <p className="text-lg font-light italic">
                    "Todos somos mortales hasta el primer beso y la segunda copa de vino"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed lg:hidden"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-[#9B774B]/80"></div>
          </div>
        </div>
      </div>
    </section>
  );
}