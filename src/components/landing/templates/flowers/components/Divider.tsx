import { motion } from 'framer-motion';

interface DividerProps {
  className?: string;
  color?: string;
}

export function Divider({ className = '', color = '#E8A87C' }: DividerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div 
        className="w-full flex items-center justify-center opacity-60"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.6, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 300 40" className="h-8">
          <path 
            d="M20 20 Q80 10, 150 20 T280 20" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
          <circle cx="20" cy="20" r="4" fill={color}/>
          <circle cx="150" cy="20" r="4" fill={color}/>
          <circle cx="280" cy="20" r="4" fill={color}/>
          
          {/* Floral elements */}
          <g transform="translate(70, 15)">
            <path d="M0 5 C-3 2, -3 -2, 0 -5 C3 -2, 3 2, 0 5 Z" fill={color} opacity="0.7"/>
            <path d="M-5 0 C-2 -3, 2 -3, 5 0 C2 3, -2 3, -5 0 Z" fill={color} opacity="0.7"/>
          </g>
          <g transform="translate(230, 15)">
            <path d="M0 5 C-3 2, -3 -2, 0 -5 C3 -2, 3 2, 0 5 Z" fill={color} opacity="0.7"/>
            <path d="M-5 0 C-2 -3, 2 -3, 5 0 C2 3, -2 3, -5 0 Z" fill={color} opacity="0.7"/>
          </g>
        </svg>
      </motion.div>
    </div>
  );
}