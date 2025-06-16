import { Gallery } from '../../../shared/Gallery';
import { motion } from 'framer-motion';


interface GallerySectionProps {
  images: string[];
  className?: string;
  textColor?: string;
}

export function GallerySection({ images, className = '', textColor = '#cfd6bb' }: GallerySectionProps) {
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
      className={`py-24 px-4 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-12" variants={item}>
          <h2 className="text-5xl md:text-6xl font-fraunces text-white mb-6">
          Retratos de Nuestro Amor
          </h2>
          <p className={`text-xl font-sans text-center text-[${textColor}]`}>
          Un minuto, un segundo, un instante que queda en la eternidad.
          </p>
        </motion.div>

        <Gallery 
          images={images}
          frameColor="#F8BBD9"
        />
      </div>
    </motion.section>
  );
}