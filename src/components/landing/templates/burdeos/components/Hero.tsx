import { motion, useScroll, useTransform } from 'framer-motion';
import topRightFlowers from '../assets/flor_hero.webp';

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
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  const formattedDate = new Date(weddingDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');

  // Delay animations until welcome modal is closed
  const baseDelay = showWelcomeModal ? 2 : 0;

  return (
    <section className={`relative w-full min-h-screen overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          y
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </motion.div>

      {/* Right Content Panel */}
      <div className="absolute right-0 top-0 h-full w-full md:w-1/2 bg-[#540A17] flex items-center justify-center p-4">
        {/* Top Right Flowers - Moved inside panel and centered */}
        <motion.img
          src={topRightFlowers}
          alt="Floral decoration top center"
          className="absolute top-[-40px] transform -translate-x-1/2 w-32 md:w-40 lg:w-48 object-contain z-30"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: baseDelay + 0.2 }}
        />

        {/* Main Content within the right panel */}
        <div className="text-center text-[#FFFCE8] max-w-sm mx-auto z-20">
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
            className="mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold font-fraunces text-[#C8A784]">
              {groomName}
              <span className="block text-4xl md:text-5xl font-lora font-normal my-2">
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
              <p className="text-5xl mb-4 font-fraunces text-[#C8A784]">“</p>
              <blockquote className="text-lg md:text-xl font-light italic leading-relaxed">
                {welcomeMessage}
              </blockquote>
              <p className="text-5xl mt-4 font-fraunces text-[#C8A784]">”</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}