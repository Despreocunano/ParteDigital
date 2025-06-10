import { motion } from 'framer-motion';
import topFlor1 from '../assets/top_flor_00001.png';
import topFlor2 from '../assets/top_flor_00002.png';
import topFlor3 from '../assets/top_flor_00003.png';

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

  const bottomImagesVariants = {
    hidden: { 
      opacity: 0, 
      y: 50
    },
    visible: (i: number) => ({
      opacity: [0.9, 0.8, 0.7][i] || 0.9,
      y: 0,
      transition: {
        delay: baseDelay + 1 + (i * 0.2),
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className={`relative w-full min-h-screen overflow-hidden ${className}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${backgroundImage})`
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Top Floral Bouquet - Left side */}
      <div className="absolute top-0 left-24 z-20 w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
        <motion.div
          className="relative w-full h-full"
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
        >
          <motion.img
            src={topFlor1}
            alt="Cherry blossom decoration 1"
            className="absolute top-0 left-0 w-full h-full object-contain opacity-90"
            custom={0}
            variants={topImagesVariants}
          />
          
          <motion.img
            src={topFlor2}
            alt="Cherry blossom decoration 2"
            className="absolute top-0 left-0 w-full h-full object-contain opacity-80"
            custom={1}
            variants={topImagesVariants}
          />
          
          <motion.img
            src={topFlor3}
            alt="Cherry blossom decoration 3"
            className="absolute top-0 left-0 w-full h-full object-contain opacity-70"
            custom={2}
            variants={topImagesVariants}
          />
        </motion.div>
      </div>

      {/* Bottom Right Floral Bouquet - Properly rotated with stems on right edge */}
      <div className="absolute bottom-0 right-0 z-20">
        <motion.div
          className="relative"
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
        >
          {/* Rotated 180 degrees so stems point to the right edge */}
          <motion.img
            src={topFlor1}
            alt="Cherry blossom decoration bottom 1"
            className="absolute w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain opacity-90"
            style={{ 
              transform: 'rotate(180deg) scaleX(-1)',
              right: 0,
              bottom: 0
            }}
            custom={0}
            variants={bottomImagesVariants}
          />
          
          <motion.img
            src={topFlor2}
            alt="Cherry blossom decoration bottom 2"
            className="absolute w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain opacity-80"
            style={{ 
              transform: 'rotate(180deg) scaleX(-1)',
              right: 0,
              bottom: 0
            }}
            custom={1}
            variants={bottomImagesVariants}
          />
          
          <motion.img
            src={topFlor3}
            alt="Cherry blossom decoration bottom 3"
            className="absolute w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain opacity-70"
            style={{ 
              transform: 'rotate(180deg) scaleX(-1)',
              right: 0,
              bottom: 0
            }}
            custom={2}
            variants={bottomImagesVariants}
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
              <p className="text-xl font-light tracking-wider">
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
            <h1 className="text-6xl md:text-8xl font-serif leading-tight">
              {groomName} 
              <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full mx-4 md:mx-8 text-3xl md:text-4xl font-light">
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
          <div className="w-px h-8 bg-white/60 mb-2"></div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l3 3 3-3"/>
            <path d="M7 6l3 3 3-3"/>
          </svg>
        </div>
      </motion.div>
    </section>
  );
}