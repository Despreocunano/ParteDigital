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
    <section className={`py-24 px-4 ${className}`}>
      <motion.div 
        className="max-w-4xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <Divider className="mb-12" />

        <motion.div 
          className="text-center mb-12"
          variants={item}
        >
          <h2 className="text-4xl font-serif text-[#D4B572]">Faltan</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            className="bg-[#1C2127] rounded-xl p-6 text-center border border-[#D4B572]/20"
            variants={item}
          >
            <div className="text-5xl font-light text-[#D4B572] mb-2">
              {timeLeft.days}
            </div>
            <div className="text-[#D4B572]/80 text-sm uppercase tracking-wide">
              días
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-[#1C2127] rounded-xl p-6 text-center border border-[#D4B572]/20"
            variants={item}
          >
            <div className="text-5xl font-light text-[#D4B572] mb-2">
              {timeLeft.hours}
            </div>
            <div className="text-[#D4B572]/80 text-sm uppercase tracking-wide">
              hs
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-[#1C2127] rounded-xl p-6 text-center border border-[#D4B572]/20"
            variants={item}
          >
            <div className="text-5xl font-light text-[#D4B572] mb-2">
              {timeLeft.minutes}
            </div>
            <div className="text-[#D4B572]/80 text-sm uppercase tracking-wide">
              min
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-[#1C2127] rounded-xl p-6 text-center border border-[#D4B572]/20"
            variants={item}
          >
            <div className="text-5xl font-light text-[#D4B572] mb-2">
              {timeLeft.seconds}
            </div>
            <div className="text-[#D4B572]/80 text-sm uppercase tracking-wide">
              seg
            </div>
          </motion.div>
        </div>

        <Divider className="mt-12" />
      </motion.div>
    </section>
  );
}