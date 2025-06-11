import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import divider from '../assets/divider.svg'


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
    <section className={`py-12 px-0 w-full ${className}`}>
      <motion.div 
        className="w-full max-w-none mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >

        <motion.div 
          className="text-center mb-12"
          variants={item}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-black text-[#995B70] mb-6">Faltan</h2>
        </motion.div>
        <img src={divider} alt="Divider" className="mx-auto mb-8" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          <motion.div 
            className="relative group"
            variants={item}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl border border-[#F8BBD9]/30 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-6xl font-bold text-[#BC913B] mb-3 font-serif">
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
              <div className="relative z-10">
                <div className="text-6xl font-bold text-[#BC913B] mb-3 font-serif">
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
              <div className="relative z-10">
                <div className="text-6xl font-bold text-[#BC913B] mb-3 font-serif">
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
              <div className="relative z-10">
                <div className="text-6xl font-bold text-[#BC913B] mb-3 font-serif">
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