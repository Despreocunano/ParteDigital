import React, { useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

interface LottieIconWrapperProps {
  size?: number;
  src: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
}

export const LottieIconWrapper: React.FC<LottieIconWrapperProps> = ({
  size = 24,
  src,
  className = '',
  autoplay = true,
  loop = true
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className={className}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={src}
        autoplay={autoplay}
        loop={loop}
      />
    </div>
  );
}; 