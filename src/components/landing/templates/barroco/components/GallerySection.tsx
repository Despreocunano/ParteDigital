import { Gallery } from '../../../shared/Gallery';
import { motion } from 'framer-motion';
import bottomHero from '../assets/flores_divisor.webp'


interface GallerySectionProps {
  images: string[];
  className?: string;
}

export function GallerySection({ images, className = '' }: GallerySectionProps) {
  if (!images?.length) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.section 
      className={`relative py-24 px-4 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-12" variants={item}>
          <h2 className="text-4xl md:text-6xl font-fraunces font-extrabold text-white mb-4">
          Retratos de Nuestro Amor
          </h2>
          <p className="text-xl font-rubik text-white">
          Un minuto, un segundo, un instante que queda en la eternidad.
          </p>
        </motion.div>

        <Gallery 
          images={images}
          frameColor="#F8BBD9"
        />
      </div>
      <img
            src={bottomHero}
            alt="Decoración inferior"
            className="absolute bottom-0 left-0 w-full object-cover z-10"
          />
    </motion.section>

  );
}