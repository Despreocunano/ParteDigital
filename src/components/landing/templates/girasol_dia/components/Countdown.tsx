import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Curva01 from '../assets/curva01.svg';
import CirculoContador from '../assets/img_circuloContador01.png';

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

export function Countdown({
  date,
  className = ''
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
      <span className="text-4xl text-[#9DB677] font-fraunces leading-none">
        {value < 10 ? `0${value}` : value}
      </span>
      <span className="text-sm text-[#9DB677] uppercase tracking-wider mt-1">
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
        className="w-full max-w-full mx-auto flex items-center justify-center py-4 relative z-10"
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true }} 
        variants={containerVariants} 
      >
        <motion.div 
          className="relative flex flex-col items-center justify-center"
          variants={itemVariants}
        >
          <motion.div 
            className="relative flex flex-col items-center justify-center p-8 h-80 w-80 lg:w-[550px] lg:h-[550px]"
            style={{
              backgroundColor: 'transparent',
              padding: '2rem',
              zIndex: 1,
              backgroundImage: `url(${CirculoContador})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            variants={itemVariants}
          >
            <h2 className="text-7xl text-[#FABE5A] font-bold  mb-4">
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
              <Heart size={36} fill="#FABE5A" stroke="#FABE5A" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}