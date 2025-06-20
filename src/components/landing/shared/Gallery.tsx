import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryProps {
  images: string[];
  frameColor?: string;
  className?: string;
}

export function Gallery({ images, frameColor = '#D4B572', className = '' }: GalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  if (!images?.length) return null;

  const handleNavigation = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next'
      ? (currentImageIndex + 1) % images.length
      : (currentImageIndex - 1 + images.length) % images.length;

    if (scrollContainerRef.current) {
      const itemWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: newIndex * itemWidth,
        behavior: 'smooth'
      });
    }
    setCurrentImageIndex(newIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handleNavigation('prev');
    if (e.key === 'ArrowRight') handleNavigation('next');
    if (e.key === 'Escape') setShowModal(false);
  };

  // Swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      if (deltaX > 50) handleNavigation('prev');
      if (deltaX < -50) handleNavigation('next');
      touchStartX.current = null;
    }
  };

  return (
    <div className={className} style={{ maxWidth: '100%' }}>
      <div className="relative px-2 md:px-12" style={{ maxWidth: '100%' }}>
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            maxWidth: '100%',
            overflowX: 'auto'
          }}
        >
          {images.map((image, index) => (
            <motion.div 
              key={index}
              className="flex-none w-full md:w-1/3 snap-start px-2"
              style={{ maxWidth: '100%' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => {
                setCurrentImageIndex(index);
                setShowModal(true);
              }}
            >
              <div 
                className="aspect-[4/3] cursor-pointer transform transition-all duration-500 hover:scale-[1.03] shadow-lg rounded-2xl"
                style={{ maxWidth: '100%' }}
              >
                <div 
                  className="w-full h-full p-3 rounded-2xl transition-colors"
                  style={{ backgroundColor: `${frameColor}20`, maxWidth: '100%' }}
                >
                  <div 
                    className="w-full h-full rounded-xl overflow-hidden border-2 transition-colors group relative"
                    style={{ borderColor: `${frameColor}40`, maxWidth: '100%' }}
                  >
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      style={{ maxWidth: '100%' }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl backdrop-blur-md border border-white/20"
              style={{ 
                backgroundColor: `${frameColor}30`,
                color: frameColor
              }}
              onClick={() => handleNavigation('prev')}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl backdrop-blur-md border border-white/20"
              style={{ 
                backgroundColor: `${frameColor}30`,
                color: frameColor
              }}
              onClick={() => handleNavigation('next')}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowModal(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            style={{ backdropFilter: 'blur(8px)' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div 
              className="absolute inset-0 bg-black/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <button
              className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors z-10 shadow-xl backdrop-blur-md border border-white/20"
              onClick={() => setShowModal(false)}
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div 
              className="relative w-full max-w-5xl aspect-[4/3] p-4 z-10 flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`Gallery image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain rounded-2xl shadow-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors shadow-xl backdrop-blur-md border border-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation('prev');
                    }}
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors shadow-xl backdrop-blur-md border border-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation('next');
                    }}
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}

              <motion.div 
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-7 py-3 rounded-full backdrop-blur-md shadow-xl text-lg font-medium tracking-wide"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentImageIndex + 1} / {images.length}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}