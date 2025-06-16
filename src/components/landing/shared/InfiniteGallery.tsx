import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface InfiniteGalleryProps {
  images: string[];
  className?: string;
  frameColor?: string;
}

export function InfiniteGallery({ images, className = '', frameColor }: InfiniteGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Duplicar las imágenes para crear el efecto infinito
  const duplicatedImages = [...images, ...images];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const firstSet = container.children[0] as HTMLElement;
    const secondSet = container.children[1] as HTMLElement;

    const sequence = async () => {
      while (true) {
        await controls.start({
          x: -firstSet.offsetWidth,
          transition: {
            duration: 15,
            ease: "linear",
          }
        });
        await controls.set({ x: 0 });
      }
    };

    sequence();
  }, [controls]);

  if (!images?.length) return null;

  return (
    <div className={className}>
      <div className="relative overflow-hidden" ref={containerRef}>
        <motion.div 
          className="flex"
          animate={controls}
        >
          {duplicatedImages.map((image, index) => (
            <div 
              key={index}
              className="flex-none w-full md:w-1/3"
            >
              <div className="aspect-[4/3]">
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover grayscale"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 