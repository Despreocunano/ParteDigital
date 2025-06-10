interface HeroProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  backgroundImage?: string;
}

export function Hero({ groomName, brideName, weddingDate, backgroundImage }: HeroProps) {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${backgroundImage || 'https://images.pexels.com/photos/1589820/pexels-photo-1589820.jpeg'})`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 backdrop-blur-[1px]"></div>
      
      <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
        <p className="text-lg md:text-xl mb-6 font-light tracking-[0.2em] uppercase">
          Te invitamos a celebrar nuestra boda
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8">
          {groomName} <br className="md:hidden" />
          <span className="font-light">&</span> <br className="md:hidden" />
          {brideName}
        </h1>
        <div className="w-px h-12 bg-white/50 mx-auto mb-8"></div>
        <p className="text-xl md:text-3xl font-light tracking-wide">
          {new Date(weddingDate).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-[2px] h-8 bg-white/50"></div>
      </div>
    </section>
  );
}