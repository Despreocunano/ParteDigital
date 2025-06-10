import { motion } from 'framer-motion';

interface DividerProps {
  className?: string;
  color?: string;
}

export function Divider({ className = '', color = '#E91E63' }: DividerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div 
        className="w-full flex items-center justify-center opacity-60"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.6, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 400 60" className="h-12 w-full max-w-md">
          {/* Cherry blossom branch */}
          <path 
            d="M50 30 Q120 20, 200 30 Q280 40, 350 30" 
            stroke={color} 
            strokeWidth="3" 
            fill="none"
            opacity="0.7"
          />
          
          {/* Large cherry blossoms */}
          <g transform="translate(100, 25)">
            <circle cx="0" cy="0" r="5" fill="#F8BBD9" opacity="0.8"/>
            <circle cx="-4" cy="-4" r="3" fill="#FCE4EC"/>
            <circle cx="4" cy="-4" r="3" fill="#FCE4EC"/>
            <circle cx="-4" cy="4" r="3" fill="#FCE4EC"/>
            <circle cx="4" cy="4" r="3" fill="#FCE4EC"/>
            <circle cx="0" cy="0" r="2" fill={color}/>
          </g>
          
          <g transform="translate(200, 30)">
            <circle cx="0" cy="0" r="6" fill="#F8BBD9" opacity="0.8"/>
            <circle cx="-5" cy="-5" r="3.5" fill="#FCE4EC"/>
            <circle cx="5" cy="-5" r="3.5" fill="#FCE4EC"/>
            <circle cx="-5" cy="5" r="3.5" fill="#FCE4EC"/>
            <circle cx="5" cy="5" r="3.5" fill="#FCE4EC"/>
            <circle cx="0" cy="0" r="2.5" fill={color}/>
          </g>
          
          <g transform="translate(300, 28)">
            <circle cx="0" cy="0" r="4" fill="#F8BBD9" opacity="0.8"/>
            <circle cx="-3" cy="-3" r="2.5" fill="#FCE4EC"/>
            <circle cx="3" cy="-3" r="2.5" fill="#FCE4EC"/>
            <circle cx="-3" cy="3" r="2.5" fill="#FCE4EC"/>
            <circle cx="3" cy="3" r="2.5" fill="#FCE4EC"/>
            <circle cx="0" cy="0" r="1.5" fill={color}/>
          </g>
          
          {/* Small buds */}
          <circle cx="150" cy="35" r="2" fill="#81C784" opacity="0.6"/>
          <circle cx="250" cy="25" r="1.5" fill="#81C784" opacity="0.6"/>
          <circle cx="320" cy="35" r="2" fill="#81C784" opacity="0.6"/>
          
          {/* Leaves */}
          <ellipse cx="130" cy="40" rx="6" ry="3" fill="#4CAF50" opacity="0.5" transform="rotate(15 130 40)"/>
          <ellipse cx="270" cy="20" rx="5" ry="2.5" fill="#4CAF50" opacity="0.5" transform="rotate(-20 270 20)"/>
        </svg>
      </motion.div>
    </div>
  );
}