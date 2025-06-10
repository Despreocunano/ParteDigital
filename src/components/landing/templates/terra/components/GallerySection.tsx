import { Gallery } from '../../../shared/Gallery';
import { motion } from 'framer-motion';
import { Divider } from './Divider';

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
      className={`py-24 px-4 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-12" variants={item}>
          <h2 className="text-3xl md:text-4xl font-serif text-[#FAB765]">
            Nuestra Historia
          </h2>
          <Divider className="mt-8" />
        </motion.div>

        <Gallery 
          images={images}
          frameColor="#DF9434"
        />
      </div>
    </motion.section>
  );
}