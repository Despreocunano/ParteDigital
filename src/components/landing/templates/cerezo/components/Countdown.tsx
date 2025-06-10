import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Divider } from './Divider';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  date: string;
  className?: string;
}

export function Countdown({ date, className = '' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(date) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [date]);

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
    <section className={`py-24 px-4 w-full ${className}`}>
      <motion.div 
        className="w-full max-w-none mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.div 
          className="text-center mb-16"
          variants={item}
        >
          <h2 className="text-3xl md:text-4xl font-serif text-[#2D1B69] mb-4">Faltan</h2>
          <Divider />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          <motion.div 
            className="relative group"
            variants={item}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl border border-[#F8BBD9]/30 relative overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <pattern id="cherry-pattern-days" patternUnits="userSpaceOnUse" width="20" height="20">
                    <circle cx="10" cy="10" r="2" fill="#E91E63"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#cherry-pattern-days)"/>
                </svg>
              </div>
              
              {/* Cherry blossom decoration */}
              <div className="absolute top-4 right-4 opacity-30">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" fill="#F8BBD9"/>
                  <circle cx="9" cy="9" r="2" fill="#FCE4EC"/>
                  <circle cx="15" cy="9" r="2" fill="#FCE4EC"/>
                  <circle cx="9" cy="15" r="2" fill="#FCE4EC"/>
                  <circle cx="15" cy="15" r="2" fill="#FCE4EC"/>
                  <circle cx="12" cy="12" r="1" fill="#E91E63"/>
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="text-6xl font-light text-[#2D1B69] mb-3 font-serif">
                  {timeLeft.days}
                </div>
                <div className="text-[#8D6E63] text-sm uppercase tracking-wider font-medium">
                  días
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative group"
            variants={item}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl border border-[#F8BBD9]/30 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <pattern id="cherry-pattern-hours" patternUnits="userSpaceOnUse" width="20" height="20">
                    <circle cx="10" cy="10" r="2" fill="#E91E63"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#cherry-pattern-hours)"/>
                </svg>
              </div>
              
              <div className="absolute top-4 right-4 opacity-30">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" fill="#F8BBD9"/>
                  <circle cx="9" cy="9" r="2" fill="#FCE4EC"/>
                  <circle cx="15" cy="9" r="2" fill="#FCE4EC"/>
                  <circle cx="9" cy="15" r="2" fill="#FCE4EC"/>
                  <circle cx="15" cy="15" r="2" fill="#FCE4EC"/>
                  <circle cx="12" cy="12" r="1" fill="#E91E63"/>
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="text-6xl font-light text-[#2D1B69] mb-3 font-serif">
                  {timeLeft.hours}
                </div>
                <div className="text-[#8D6E63] text-sm uppercase tracking-wider font-medium">
                  horas
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative group"
            variants={item}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl border border-[#F8BBD9]/30 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <pattern id="cherry-pattern-minutes" patternUnits="userSpaceOnUse" width="20" height="20">
                    <circle cx="10" cy="10" r="2" fill="#E91E63"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#cherry-pattern-minutes)"/>
                </svg>
              </div>
              
              <div className="absolute top-4 right-4 opacity-30">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" fill="#F8BBD9"/>
                  <circle cx="9" cy="9" r="2" fill="#FCE4EC"/>
                  <circle cx="15" cy="9" r="2" fill="#FCE4EC"/>
                  <circle cx="9" cy="15" r="2" fill="#FCE4EC"/>
                  <circle cx="15" cy="15" r="2" fill="#FCE4EC"/>
                  <circle cx="12" cy="12" r="1" fill="#E91E63"/>
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="text-6xl font-light text-[#2D1B69] mb-3 font-serif">
                  {timeLeft.minutes}
                </div>
                <div className="text-[#8D6E63] text-sm uppercase tracking-wider font-medium">
                  minutos
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative group"
            variants={item}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl border border-[#F8BBD9]/30 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <pattern id="cherry-pattern-seconds" patternUnits="userSpaceOnUse" width="20" height="20">
                    <circle cx="10" cy="10" r="2" fill="#E91E63"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#cherry-pattern-seconds)"/>
                </svg>
              </div>
              
              <div className="absolute top-4 right-4 opacity-30">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" fill="#F8BBD9"/>
                  <circle cx="9" cy="9" r="2" fill="#FCE4EC"/>
                  <circle cx="15" cy="9" r="2" fill="#FCE4EC"/>
                  <circle cx="9" cy="15" r="2" fill="#FCE4EC"/>
                  <circle cx="15" cy="15" r="2" fill="#FCE4EC"/>
                  <circle cx="12" cy="12" r="1" fill="#E91E63"/>
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="text-6xl font-light text-[#2D1B69] mb-3 font-serif">
                  {timeLeft.seconds}
                </div>
                <div className="text-[#8D6E63] text-sm uppercase tracking-wider font-medium">
                  segundos
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}