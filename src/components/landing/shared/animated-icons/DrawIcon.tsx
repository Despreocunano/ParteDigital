import React from 'react';
import { motion } from 'framer-motion';

interface DrawIconProps {
  size?: number;
  color?: string;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}

export const DrawIcon: React.FC<DrawIconProps> = ({
  size = 24,
  color = 'currentColor',
  duration = 2,
  className = '',
  children
}) => {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        color,
      }}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration,
          ease: "easeInOut",
          repeat: 0
        }}
      >
        {children}
      </motion.svg>
    </motion.div>
  );
}; 