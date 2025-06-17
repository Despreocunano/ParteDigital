import { motion } from 'framer-motion';

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
            <div className="flex items-center gap-4 justify-center">
              <div className="w-full h-px bg-white"></div>
              <p className="text-3xl font-light tracking-wider">
                {formattedDate}
              </p>
              <div className="w-full h-px bg-white"></div>
            </div>
          </motion.div>

          {/* Names */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.4 }}
          >
            <h1 className="text-6xl md:text-7xl font-poppins font-bold leading-tight">
              {groomName} 
              <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full mx-4 md:mx-8 text-3xl md:text-4xl font-light">
                &
              </span> 
              {brideName}
            </h1>
            <div className="w-full h-px bg-white mx-auto mt-6"></div>
          </motion.div>

          {/* Welcome Message */}
          {welcomeMessage && (
            <motion.div 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.6 }}
            >
              <blockquote className="text-xl md:text-3xl font-rubik leading-relaxed">
                "{welcomeMessage}"
              </blockquote>
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