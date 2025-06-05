import React, { useState, useEffect } from 'react';

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

  return (
    <section className={`py-24 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-[#D4B572]">Falta</h2>
          <div className="w-px h-12 bg-[#D4B572]/30 mx-auto mt-8"></div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#1C2127] rounded-xl p-6 text-center border border-[#D4B572]/20">
            <div className="text-5xl font-light text-[#D4B572] mb-2">
              {timeLeft.days}
            </div>
            <div className="text-[#D4B572]/80 text-sm uppercase tracking-wide">
              días
            </div>
          </div>
          
          <div className="bg-[#1C2127] rounded-xl p-6 text-center border border-[#D4B572]/20">
            <div className="text-5xl font-light text-[#D4B572] mb-2">
              {timeLeft.hours}
            </div>
            <div className="text-[#D4B572]/80 text-sm uppercase tracking-wide">
              hs
            </div>
          </div>
          
          <div className="bg-[#1C2127] rounded-xl p-6 text-center border border-[#D4B572]/20">
            <div className="text-5xl font-light text-[#D4B572] mb-2">
              {timeLeft.minutes}
            </div>
            <div className="text-[#D4B572]/80 text-sm uppercase tracking-wide">
              min
            </div>
          </div>
          
          <div className="bg-[#1C2127] rounded-xl p-6 text-center border border-[#D4B572]/20">
            <div className="text-5xl font-light text-[#D4B572] mb-2">
              {timeLeft.seconds}
            </div>
            <div className="text-[#D4B572]/80 text-sm uppercase tracking-wide">
              seg
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <div className="w-8 h-8 rounded-full border-2 border-[#D4B572]/30 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#D4B572]/30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}