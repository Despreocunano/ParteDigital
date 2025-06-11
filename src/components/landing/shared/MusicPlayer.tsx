import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import useSound from 'use-sound';

interface MusicPlayerProps {
  url?: string;
  color?: string;
  autoplay?: boolean;
  className?: string;
}

export function MusicPlayer({ url, color = '#D4B572', autoplay = false, className = '' }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { pause, sound }] = useSound(url || '', {
    volume: 0.5,
    interrupt: true,
    autoplay: false,
    loop: true
  });
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (autoplay && !isPlaying && url && !hasPlayed.current) {
      const timer = setTimeout(() => {
        setIsPlaying(true);
        play();
        hasPlayed.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoplay, play, isPlaying, url]);

  useEffect(() => {
    return () => {
      pause();
      setIsPlaying(false);
      hasPlayed.current = false;
    };
  }, [pause]);

  if (!url) return null;

  const togglePlay = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      if (!hasPlayed.current) {
        play();
        hasPlayed.current = true;
      } else {
        sound?.play();
      }
      setIsPlaying(true);
    }
  };

  return (
    <div 
      className={`fixed bottom-8 right-8 z-50 ${className}`}
      style={{ '--player-color': color } as React.CSSProperties}
    >
      <button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 group relative"
        style={{ 
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 2px ${color}20`
        }}
      >
        {isPlaying ? (
          <Pause 
            className="w-5 h-5 transition-colors duration-200" 
            style={{ color }}
          />
        ) : (
          <Play 
            className="w-5 h-5 transition-colors duration-200" 
            style={{ color }}
          />
        )}
        
        {/* Animated music waves */}
        <div 
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-opacity duration-200 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundColor: color }}
        >
          <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: color }}></div>
        </div>
      </button>
    </div>
  );
}