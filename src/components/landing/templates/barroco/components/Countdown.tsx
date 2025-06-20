import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <section className={`py-24 px-0 w-full ${className}`}>
      <motion.div 
        className="w-full max-w-none mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >

        <motion.div 
          className="text-center"
          variants={item}
        >
          <h2 className="text-4xl md:text-6xl font-fraunces font-extrabold text-[#B87600] mb-4">Faltan</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          <motion.div 
            className="relative group"
            variants={item}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-6xl font-bold text-[#333333] mb-3 font-surana">
                  {timeLeft.days}
                </div>
                <div className="text-[#C8A784] text-lg uppercase tracking-wider font-sans">
                  días
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative group"
            variants={item}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-6xl font-bold text-[#333333] mb-3 font-surana">
                  {timeLeft.hours}
                </div>
                <div className="text-[#C8A784] text-lg uppercase tracking-wider font-sans">
                  horas
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative group"
            variants={item}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-6xl font-bold text-[#333333] mb-3 font-surana">
                  {timeLeft.minutes}
                </div>
                <div className="text-[#C8A784] text-lg uppercase tracking-wider font-sans">
                  minutos
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative group"
            variants={item}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-6xl font-bold text-[#333333] mb-3 font-surana">
                  {timeLeft.seconds}
                </div>
                <div className="text-[#C8A784] text-lg uppercase tracking-wider font-sans">
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