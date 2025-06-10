import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LottieIconProps {
  src: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  speed?: number;
  onComplete?: () => void;
  onLoad?: () => void;
}

export function LottieIcon({
  src,
  className = 'w-12 h-12',
  autoplay = true,
  loop = true,
  speed = 1,
  onComplete,
  onLoad
}: LottieIconProps) {
  return (
    <div className={className}>
      <DotLottieReact
        src={src}
        autoplay={autoplay}
        loop={loop}
        speed={speed}
        onComplete={onComplete}
        onLoad={onLoad}
      />
    </div>
  );
}