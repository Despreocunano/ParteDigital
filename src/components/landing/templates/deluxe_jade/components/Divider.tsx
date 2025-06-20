import { motion } from 'framer-motion';

interface DividerProps {
  className?: string;
  color?: string;
}

export function Divider({ className = '', color = '#D4B572' }: DividerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div 
        className="w-full flex items-center justify-center opacity-50"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.5, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="206" height="6" viewBox="0 0 206 6" fill={color} className="transform -scale-x-100">
          <g>
            <path d="M0.09 3.04997C58.75 4.19997 117.68 4.43997 176.34 3.37997C176.89 3.37997 176.89 2.52997 176.34 2.51997C117.68 1.46997 58.75 1.69997 0.09 2.85997C-0.03 2.85997 -0.03 3.04997 0.09 3.04997Z"/>
            <path d="M198.47 2.96C198.47 1.36 197.11 0 195.51 0C193.91 0 192.55 1.35 192.55 2.96C192.55 4.57 193.91 5.92 195.51 5.92C197.11 5.92 198.47 4.57 198.47 2.96Z"/>
            <path d="M189.48 2.51999C189.48 2.51999 186.2 0.519992 186.2 2.51999C186.2 5.51999 189.48 5.51999 189.48 2.51999Z"/>
            <path d="M205.76 2.51999C205.76 2.51999 202.48 0.519992 202.48 2.51999C202.48 5.51999 205.76 5.51999 205.76 2.51999Z"/>
          </g>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="206" height="6" viewBox="0 0 206 6" fill={color} className="ml-4">
          <g>
            <path d="M0.09 3.04997C58.75 4.19997 117.68 4.43997 176.34 3.37997C176.89 3.37997 176.89 2.52997 176.34 2.51997C117.68 1.46997 58.75 1.69997 0.09 2.85997C-0.03 2.85997 -0.03 3.04997 0.09 3.04997Z"/>
            <path d="M198.47 2.96C198.47 1.36 197.11 0 195.51 0C193.91 0 192.55 1.35 192.55 2.96C192.55 4.57 193.91 5.92 195.51 5.92C197.11 5.92 198.47 4.57 198.47 2.96Z"/>
            <path d="M189.48 2.51999C189.48 2.51999 186.2 0.519992 186.2 2.51999C186.2 5.51999 189.48 5.51999 189.48 2.51999Z"/>
            <path d="M205.76 2.51999C205.76 2.51999 202.48 0.519992 202.48 2.51999C202.48 5.51999 205.76 5.51999 205.76 2.51999Z"/>
          </g>
        </svg>
      </motion.div>
    </div>
  );
}