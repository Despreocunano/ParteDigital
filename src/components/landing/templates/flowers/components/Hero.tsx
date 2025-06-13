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
  backgroundImage = 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg',
  className = ''
}: HeroProps) {
  const formattedDate = new Date(weddingDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  return (
    <section className={`relative h-auto ${className}`}>
    <div className="grid grid-rows-[auto_auto] lg:grid-cols-2 h-full">
      {/* Imagen arriba en mobile, a la izquierda en desktop */}
      <div className="relative h-[40vh] lg:h-full order-1">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      </div>
  
      {/* Contenido debajo en mobile, a la derecha en desktop */}
        <div className="relative flex items-center justify-center p-4 lg:p-6 z-10 lg:bg-transparent order-2">
          <div className="relative text-center text-[#8B4513] w-full max-w-2xl mx-auto">
            {/* Floral decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 -translate-x-4 -translate-y-4">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/40">
                <path d="M50 20 C30 30, 30 50, 50 60 C70 50, 70 30, 50 20 Z" fill="currentColor"/>
                <path d="M20 50 C30 30, 50 30, 60 50 C50 70, 30 70, 20 50 Z" fill="currentColor"/>
                <path d="M50 80 C70 70, 70 50, 50 40 C30 50, 30 70, 50 80 Z" fill="currentColor"/>
                <path d="M80 50 C70 70, 50 70, 40 50 C50 30, 70 30, 80 50 Z" fill="currentColor"/>
                <circle cx="50" cy="50" r="8" fill="#D2691E"/>
              </svg>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 translate-x-4 -translate-y-4 rotate-90">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/40">
                <path d="M50 20 C30 30, 30 50, 50 60 C70 50, 70 30, 50 20 Z" fill="currentColor"/>
                <path d="M20 50 C30 30, 50 30, 60 50 C50 70, 30 70, 20 50 Z" fill="currentColor"/>
                <path d="M50 80 C70 70, 70 50, 50 40 C30 50, 30 70, 50 80 Z" fill="currentColor"/>
                <path d="M80 50 C70 70, 50 70, 40 50 C50 30, 70 30, 80 50 Z" fill="currentColor"/>
                <circle cx="50" cy="50" r="8" fill="#D2691E"/>
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-32 h-32 -translate-x-4 translate-y-4 -rotate-90">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/40">
                <path d="M50 20 C30 30, 30 50, 50 60 C70 50, 70 30, 50 20 Z" fill="currentColor"/>
                <path d="M20 50 C30 30, 50 30, 60 50 C50 70, 30 70, 20 50 Z" fill="currentColor"/>
                <path d="M50 80 C70 70, 70 50, 50 40 C30 50, 30 70, 50 80 Z" fill="currentColor"/>
                <path d="M80 50 C70 70, 50 70, 40 50 C50 30, 70 30, 80 50 Z" fill="currentColor"/>
                <circle cx="50" cy="50" r="8" fill="#D2691E"/>
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 translate-x-4 translate-y-4 rotate-180">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/40">
                <path d="M50 20 C30 30, 30 50, 50 60 C70 50, 70 30, 50 20 Z" fill="currentColor"/>
                <path d="M20 50 C30 30, 50 30, 60 50 C50 70, 30 70, 20 50 Z" fill="currentColor"/>
                <path d="M50 80 C70 70, 70 50, 50 40 C30 50, 30 70, 50 80 Z" fill="currentColor"/>
                <path d="M80 50 C70 70, 50 70, 40 50 C50 30, 70 30, 80 50 Z" fill="currentColor"/>
                <circle cx="50" cy="50" r="8" fill="#D2691E"/>
              </svg>
            </div>

          {/* Texto principal */}
          <div className="py-20 px-2">
            <p className="text-lg mb-6 font-light tracking-[0.2em] uppercase">
              {formattedDate}
            </p>
            <div className="space-y-4 mb-8">
              <h1 className="text-8xl md:text-9xl font-serif">
                {groomName.charAt(0)} <span className="font-light text-[#9B774D] text-7xl md:text-8xl">&</span> {brideName.charAt(0)}
              </h1>
              <p className="text-3xl md:text-4xl font-light tracking-widest uppercase">
                {groomName} & {brideName}
              </p>
            </div>
            {welcomeMessage && (
              <>
                <p className="text-xl font-light leading-relaxed mb-6">
                  {welcomeMessage}
                </p>
                <div className="flex justify-center">
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}