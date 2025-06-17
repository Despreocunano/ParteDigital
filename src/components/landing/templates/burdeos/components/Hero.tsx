import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import topRightFlowers from '../assets/flor_hero.webp';
import verticalSeparator from '../assets/curva_portada_vertical.svg';

interface HeroProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  welcomeMessage?: string;
  backgroundImage?: string;
  className?: string;
  showWelcomeModal?: boolean;
}

export function Hero({
  groomName,
  brideName,
  weddingDate,
  welcomeMessage,
  backgroundImage = 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg',
  className = '',
  showWelcomeModal = false
}: HeroProps) {
  const formattedDate = new Date(weddingDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');

  // Delay animations until welcome modal is closed
  const baseDelay = showWelcomeModal ? 2 : 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile and Desktop Layout */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Left Side - Background Image (50% on desktop, full height on mobile) */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-screen relative">
          <img 
            src={backgroundImage} 
            alt="Wedding background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Vertical Separator - Only visible on desktop */}
        <div className="hidden md:block absolute left-[47%] top-0 h-full z-0 transform -translate-x-1/2">
          <img 
            src={verticalSeparator} 
            alt="Decorative separator"
            className="h-full w-auto"
          />
        </div>
        
        {/* Right Side - Content Panel (50% on desktop, full width on mobile) */}
        <div className="w-full md:w-1/2 bg-[#540A17] min-h-[60vh] md:min-h-screen flex items-center justify-center p-6 relative">
          {/* Top Flowers */}
          <motion.img
            src={topRightFlowers}
            alt="Floral decoration"
            className="absolute hidden md:block top-[-40px] transform -translate-x-1/2 w-32 md:w-40 lg:w-48 object-contain z-30"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: baseDelay + 0.2 }}
          />

          {/* Main Content */}
          <div className="text-center text-[#FFFCE8] max-w-sm mx-auto z-20 pt-8 md:pt-0">
            {/* Date */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.6 }}
            >
              <div className="inline-block border border-[#C8A784] px-4 py-1 font-fraunces font-bold text-white/90 text-sm md:text-base tracking-widest uppercase">
                <p>{formattedDate}</p>
              </div>
            </motion.div>

            {/* Names */}
            <motion.div
              className="mb-8 md:mb-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: baseDelay + 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-fraunces text-[#C8A784]">
                {groomName}
                <span className="block text-3xl md:text-4xl lg:text-5xl font-lora font-normal my-2">
                  &
                </span>
                {brideName}
              </h1>
            </motion.div>

            {/* Welcome Message */}
            {welcomeMessage && (
              <motion.div
                className="max-w-xs mx-auto text-center font-lora text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: baseDelay + 1 }}
              >
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-[#C8A784] transform rotate-180" />
                  <blockquote className="text-base md:text-lg lg:text-xl font-light italic leading-relaxed px-6 pt-4">
                    {welcomeMessage}
                  </blockquote>
                  <Quote className="absolute -bottom-2 -right-2 w-6 h-6 text-[#C8A784]" />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}