import React from 'react';
import { motion, Variants } from 'framer-motion';

export interface AnimatedIconProps {
  size?: number;
  color?: string;
  animationType?: 'bounce' | 'pulse' | 'rotate' | 'shake';
  duration?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

const getAnimationVariants = (type: AnimatedIconProps['animationType']): Variants => {
  switch (type) {
    case 'bounce':
      return {
        initial: { y: 0 },
        animate: {
          y: [0, -10, 0],
          transition: {
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }
      };
    case 'pulse':
      return {
        initial: { scale: 1 },
        animate: {
          scale: [1, 1.1, 1],
          transition: {
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }
      };
    case 'rotate':
      return {
        initial: { rotate: 0 },
        animate: {
          rotate: 360,
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }
        }
      };
    case 'shake':
      return {
        initial: { x: 0 },
        animate: {
          x: [0, -5, 5, -5, 5, 0],
          transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2
          }
        }
      };
    default:
      return {
        initial: {},
        animate: {}
      };
  }
};

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  size = 24,
  color = 'currentColor',
  animationType = 'pulse',
  duration,
  delay = 0,
  className = '',
  children
}) => {
  const variants = getAnimationVariants(animationType);

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        color,
      }}
      className={className}
      variants={variants}
      animate="animate"
      initial="initial"
      transition={{
        duration,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}; 