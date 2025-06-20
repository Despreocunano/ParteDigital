import Lottie from 'lottie-react';
import animationData from './lotties/gifts.json';
import { useRef, useEffect } from 'react';

export function GiftsIcon() {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5); // Velocidad más lenta
    }
  }, []);

  return (
    <div className="w-28 h-32 mx-auto mb-8">
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        autoplay
        loop
      />
    </div>
  );
}