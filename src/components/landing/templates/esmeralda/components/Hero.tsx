import { motion, useScroll, useTransform } from 'framer-motion';
import backgroundImage from '../assets/fondo_esmeralda.webp'
import topFlowers_a from '../assets/Grupo01_a.webp'
import topFlowers_b from '../assets/Grupo01_b.webp'
import topFlowers_c from '../assets/Grupo01_c.webp'


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
  className = '',
  showWelcomeModal = false
}: HeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  const formattedDate = new Date(weddingDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');

  // Delay animations until welcome modal is closed
  const baseDelay = showWelcomeModal ? 2 : 0;

  const topImagesVariants = {
    hidden: { 
      opacity: 0, 
      y: -50
    },
    visible: (i: number) => ({
      opacity: [0.9, 0.8, 0.7][i] || 0.9,
      y: 0,
      transition: {
        delay: baseDelay + (i * 0.2),
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className={`relative w-full min-h-screen overflow-hidden ${className}`}>
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          y
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </motion.div>

      {/* Top Floral Bouquet - Centered */}
      <div className="absolute -top-16 md:-top-32 left-1/2 transform -translate-x-1/2 z-20 w-48 h-48 md:w-56 md:h-56 lg:w-96 lg:h-96">
        <motion.div
          className="relative w-full h-full"
          initial="hidden"
          animate="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          <motion.img
            src={topFlowers_a}
            alt="Floral decoration 1"
            className="absolute top-0 left-0 w-full h-full object-contain opacity-90"
            custom={0}
            variants={topImagesVariants}
          />
          
          <motion.img
            src={topFlowers_b}
            alt="Floral decoration 2"
            className="absolute top-0 left-0 w-full h-full object-contain opacity-80"
            custom={1}
            variants={topImagesVariants}
          />
          
          <motion.img
            src={topFlowers_c}
            alt="Floral decoration 3"
            className="absolute top-0 left-0 w-full h-full object-contain opacity-70"
            custom={2}
            variants={topImagesVariants}
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4">
        <div className="text-center text-white max-w-4xl mx-auto w-full">
          {/* Date */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: baseDelay + 0.2 }}
          >
            <div className="inline-block">
              <div className="w-32 h-px bg-white mb-4"></div>
              <p className="text-3xl font-light tracking-wider">
                {formattedDate}
              </p>
              <div className="w-32 h-px bg-white mt-4"></div>
            </div>
          </motion.div>

          {/* Names */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.4 }}
          >
            <h1 className="text-7xl md:text-8xl font-light font-parisienne font-light">
              {groomName}
              <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#CFD6BA]/30 backdrop-blur-sm rounded-full mx-4 md:mx-8 text-3xl md:text-4xl font-lora">
                &
              </span> 
              {brideName}
            </h1>
          </motion.div>

          {/* Welcome Message */}
          {welcomeMessage && (
            <motion.div 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.6 }}
            >
              <div className="w-48 h-px bg-white/60 mx-auto mb-6"></div>
              <blockquote className="text-xl md:text-2xl font-light italic leading-relaxed">
                "{welcomeMessage}"
              </blockquote>
              <div className="w-48 h-px bg-white/60 mx-auto mt-6"></div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-10"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          y: [0, 10, 0] 
        }}
        transition={{ 
          opacity: { delay: baseDelay + 1, duration: 0.6 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: baseDelay + 1 }
        }}
      >
        <div className="flex flex-col items-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      </motion.div>
    </section>
  );
}