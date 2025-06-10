import cornerSvg from '../assets/corner.svg';
import separatorSvg from '../assets/separator.svg';

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
  backgroundImage = 'https://images.pexels.com/photos/931796/pexels-photo-931796.jpeg',
  className = ''
}: HeroProps) {
  const formattedDate = new Date(weddingDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  return (
    <section className={`relative h-[90vh] ${className}`}>
      <div className="grid lg:grid-cols-2 h-full">
        {/* Left side - Image */}
        <div className="relative h-full lg:block">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${backgroundImage})`
            }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="relative flex items-center justify-center p-4 lg:p-6 z-10">
          <div className="relative text-center text-[#D4B572] w-full max-w-2xl mx-auto">
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
                    <img src={separatorSvg} alt="" className="h-12 opacity-50" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile background overlay */}
        <div className="absolute inset-0 lg:hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${backgroundImage})`
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}