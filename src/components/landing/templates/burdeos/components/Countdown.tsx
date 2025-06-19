import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Curva01 from '../assets/curva01.svg';
import FloresContador from '../assets/flores_contador.webp';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  date: string;
  className?: string;
  secondaryColor?: string;
  textColor?: string;
}

export function Countdown({
  date,
  className = '',
  secondaryColor = '#E4C4A0',
  textColor = 'white'
}: CountdownProps) {
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
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [date]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const renderTimeUnit = (value: number, label: string) => (
    <motion.div 
      className="flex flex-col items-center justify-center min-w-[60px]"
      variants={itemVariants}
    >
      <span className="text-2xl font-fraunces leading-none" style={{ color: secondaryColor }}>
        {value < 10 ? `0${value}` : value}
      </span>
      <span className="text-sm uppercase tracking-wider mt-1" style={{ color: secondaryColor }}>
        {label}
      </span>
    </motion.div>
  );

  return (
    <section className={`relative pt-0 px-0 w-full ${className}`}>
      <img 
        src={Curva01}
        alt="separator"
        className="absolute left-0 right-0 w-full h-auto mx-auto"
        style={{ 
          top: '-3%',
          transform: 'translateY(-50%)',
          zIndex: 0
        }}
      />
      <motion.div 
        className="w-full max-w-full mx-auto flex items-center justify-center py-8 relative z-10"
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true }} 
        variants={containerVariants} 
      >
        <motion.div 
          className="relative flex flex-col items-center justify-center"
          variants={itemVariants}
        >
          <img 
            src={FloresContador}
            alt="Flores decorativas"
            className="w-64 h-auto absolute -top-24 md:-top-20 -left-6 z-50"
          />
          <motion.div 
            className="relative flex flex-col items-center justify-center p-8 rounded-full shadow-2xl h-auto w-72 lg:w-80 lg:h-80"
            style={{
              backgroundColor: '#33040E',
              borderColor: secondaryColor,
              borderWidth: '2px',
              borderStyle: 'solid',
              padding: '2rem',
              zIndex: 1
            }}
            variants={itemVariants}
          >
            <h2 className="text-5xl font-bold font-fraunces mb-4" style={{ color: textColor }}>
              Falta
            </h2>

            <div className="relative flex items-center justify-center mb-4">
              {renderTimeUnit(timeLeft.days, 'DÍAS')}
              {renderTimeUnit(timeLeft.hours, 'HS')}
              {renderTimeUnit(timeLeft.minutes, 'MIN')}
              {renderTimeUnit(timeLeft.seconds, 'SEG')}
            </div>

            <motion.div 
              className="mt-2"
              variants={itemVariants}
            >
              <Heart size={36} fill={secondaryColor} stroke={secondaryColor} />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}