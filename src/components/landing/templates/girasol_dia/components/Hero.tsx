import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import topflor_a from '../assets/flores_top_a.webp';
import topflor_b from '../assets/flores_top_b.webp';
import topflor_c from '../assets/flores_top_c.webp';

import verticalSeparator from '../assets/curva_portada_vertical.svg';
import horizontalSeparator from '../assets/curva_portada_horizontal.png';

interface HeroProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  welcomeMessage?: string;
  className?: string;
  showWelcomeModal?: boolean;
  coverImage?: string;
}

export function Hero({
  groomName,
  brideName,
  weddingDate,
  welcomeMessage,
  className = '',
  showWelcomeModal = false,
  coverImage
}: HeroProps) {
  const formattedDate = new Date(weddingDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');

  // Delay animations until welcome modal is closed
  const baseDelay = showWelcomeModal ? 1 : 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile and Desktop Layout */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Left Side - Background Image (50% on desktop, full height on mobile) */}
        <div className="w-full md:basis-[56%] h-[70vh] md:h-screen relative">
          <img 
            src={coverImage || "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg"} 
            alt="Wedding background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Horizontal Separator - Only visible on mobile */}
        <div className="block md:hidden w-full relative z-10">
          <img 
            src={horizontalSeparator} 
            alt="Decorative horizontal separator"
            className="w-full h-auto transform -translate-y-1/2 -mt-11"
          />
        </div>
        
        {/* Vertical Separator - Only visible on desktop */}
        <div className="hidden md:block absolute left-[52%] top-0 h-full z-0 transform -translate-x-1/2">
          <img 
            src={verticalSeparator} 
            alt="Decorative separator"
            className="h-full w-auto"
          />
        </div>
        
        {/* Right Side - Content Panel (50% on desktop, full width on mobile) */}
        <div className="w-full md:basis-[44%] bg-[#F5FFF5] min-h-[20vh] md:min-h-screen flex items-center justify-center pb-16 md:pb-6 relative">
          {/* Top Flowers */}
          <motion.img
            src={topflor_a}
            alt="Floral decoration"
            className="absolute hidden md:block top-[-10px] transform -translate-x-1/2 w-32 md:w-40 lg:w-96 object-contain z-30"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: baseDelay + 0.2 }}
          />
                   <motion.img
            src={topflor_b}
            alt="Floral decoration"
            className="absolute hidden md:block top-[-10px] transform -translate-x-1/2 w-32 md:w-40 lg:w-72 object-contain z-0"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: baseDelay + 0.5 }}
          />

          {/* Main Content */}
          <div className="text-center text-[#FFFCE8] max-w-sm mx-auto z-20 pt-0">
            {/* Date */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.6 }}
            >
              <div className="inline-block border border-[#9DB677] px-4 py-2 font-libre font-bold text-[#9DB677] text-sm md:text-2xl tracking-widest uppercase">
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
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold font-abril text-[#FABE5A]">
                {groomName}
                <span className="block text-3xl md:text-4xl lg:text-5xl text-[#998478] font-sans font-normal">
                  &
                </span>
                {brideName}
              </h1>
            </motion.div>

            {/* Welcome Message */}
            {welcomeMessage && (
              <motion.div
                className="max-w-md mx-auto text-center font-opensans font-light text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: baseDelay + 1 }}
              >
                <div className="relative">
                  <Quote className="absolute -top-0 -left-2 w-8 h-8 text-[#9db677] transform rotate-180" />
                  <blockquote className="text-lg lg:text-2xl px-6 pt-4">
                    {welcomeMessage}
                  </blockquote>
                  <Quote className="absolute -bottom-0 -right-2 w-8 h-8 text-[#9db677]" />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}