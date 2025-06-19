import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  tabText: string;
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/sorostica/image/upload/v1750035389/slider_01_jlsnua.avif',
    title: 'Diseños increíbles.',
    description: 'Elige entre decenas de diseños, selecciona el que más te guste, previsualiza tu invitación y compartela con tus amigos.',
    tabText: 'Diseños increíbles'
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/sorostica/image/upload/v1750035389/slider_02_aflfwv.avif',
    title: 'Una invitación 100% digital.',
    description: 'Olvidate de los papeles, PDFs y planillas de excel. Comparte tu invitación de inmediato.',
    tabText: '100% Digital'
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/sorostica/image/upload/v1750035390/slider_03_ho7sp7.jpg',
    title: 'Tu matrimonio, tus recuerdos.',
    description: 'Tu invitación permanecerá disponibles para siempre, puedes volver a recordar el momento mas feliz de tu vida las veces que quieras.',
    tabText: 'Un recuerdo para siempre'
  }
];

export function DemoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length);
  }, []);

  const handleTabClick = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
  };

  // Autoplay functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Reset pause when user stops interacting
  useEffect(() => {
    if (!isPaused) return;

    const timeout = setTimeout(() => {
      setIsPaused(false);
    }, 5000); // Resume autoplay after 10 seconds of inactivity

    return () => clearTimeout(timeout);
  }, [isPaused]);

  const currentItem = carouselItems[currentIndex];

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Carousel Card */}
        <div 
          className="relative w-full h-[500px] md:h-[280px] rounded-2xl shadow-lg overflow-hidden bg-white flex flex-col md:flex-row"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence initial={false} mode='wait'>
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col md:flex-row"
            >
              {/* Image Section */}
              <div className="relative w-full md:w-[65%] h-[140px] md:h-full rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden flex items-center justify-center">
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Overlay for subtle lighting, mimicking the original image's glow/light source */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-yellow-300/10"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-white/20 to-transparent"></div>
              </div>

              {/* Content Section */}
              <div className="w-full md:w-[35%] p-6 md:p-8 flex flex-col justify-center text-left">
                <h3 className="text-2xl md:text-2xl font-bold text-slate-600 mb-4 leading-tight">
                  {currentItem.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {currentItem.description}
                </p>
                {currentItem.buttonText && currentItem.buttonLink && (
                  <a
                    href={currentItem.buttonLink}
                    className="inline-flex self-start items-center justify-center px-6 py-2 text-base rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 font-medium shadow-md"
                  >
                    {currentItem.buttonText}
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute -left-6 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 z-20 transition-colors focus:outline-none"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-6 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 z-20 transition-colors focus:outline-none"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Tabs Navigation */}
          <div className="flex justify-center w-full mx-auto relative z-10 mt-6">
            <div className="flex w-full bg-rose-500 rounded-lg relative">
              {/* Triangle Indicator */}
              <motion.div
                className="absolute w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-rose-600 z-30"
                initial={false}
                animate={{
                  left: `calc(${(currentIndex * (100 / carouselItems.length)) + (100 / carouselItems.length) / 2}% + 0px)`
                }}
                transition={{ duration: 0.3 }}
                style={{
                  top: '-10px',
                  transform: 'translateX(-50%)'
                }}
              />
              {carouselItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative flex-1 group`}
                >
                  <button
                    onClick={() => handleTabClick(index)}
                    className={`w-full px-4 py-3 text-lg transition-all duration-300 relative font-normal 
                      ${currentIndex === index
                        ? 'bg-rose-600 text-white font-semibold z-20'
                        : 'bg-rose-500 text-white hover:bg-rose-600 z-10'
                      } 
                    `}
                  >
                    {item.tabText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Dots Navigation */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'bg-rose-600 w-4' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 