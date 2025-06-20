import Lottie from 'lottie-react';
import animationData from './lotties/confeti.json';
import { useRef, useEffect } from 'react';

export function ConfetiIcon() {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.6); // Velocidad más lenta
    }
  }, []);

  return (
    <div className="w-32 h-32 mx-auto mb-8">
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        autoplay
        loop
      />
    </div>
  );
}