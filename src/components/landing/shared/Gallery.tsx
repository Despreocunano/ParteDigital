import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryProps {
  images: string[];
  frameColor?: string;
  className?: string;
}

export function Gallery({ images, frameColor = '#D4B572', className = '' }: GalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={className}>
      <div className="relative px-12">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {images.map((image, index) => (
            <div 
              key={index}
              className="flex-none w-full md:w-1/3 snap-start px-2"
              onClick={() => {
                setCurrentImageIndex(index);
                setShowModal(true);
              }}
            >
              <div 
                className="aspect-[4/3] cursor-pointer transform transition-all duration-300 hover:scale-[1.02]"
              >
                <div 
                  className="w-full h-full p-3 rounded-xl transition-colors"
                  style={{ backgroundColor: `${frameColor}20` }}
                >
                  <div 
                    className="w-full h-full rounded-lg overflow-hidden border transition-colors"
                    style={{ borderColor: `${frameColor}30` }}
                  >
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ 
            backgroundColor: `${frameColor}20`,
            color: frameColor
          }}
          onClick={() => handleNavigation('prev')}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ 
            backgroundColor: `${frameColor}20`,
            color: frameColor
          }}
          onClick={() => handleNavigation('next')}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setShowModal(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            onClick={() => setShowModal(false)}
          >
            <X className="w-8 h-8" />
          </button>

          <div 
            className="relative w-full max-w-5xl aspect-[4/3] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentImageIndex]}
              alt={`Gallery image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />

            <button
              className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigation('prev');
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigation('next');
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}