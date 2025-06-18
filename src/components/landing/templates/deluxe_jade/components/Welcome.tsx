import { motion } from 'framer-motion';
import { Divider } from './Divider';

interface WelcomeProps {
  message: string;
  className?: string;
}

export function Welcome({ message, className = '' }: WelcomeProps) {
  if (!message) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className={`py-32 px-4 ${className}`}>
      <motion.div 
        className="max-w-3xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <Divider className="mb-12" />
        
        <motion.div variants={item}>
          <p className="text-2xl md:text-3xl text-[#D4B572]/80 font-light leading-relaxed text-center">
            {message}
          </p>
        </motion.div>

        <Divider className="mt-12" />
      </motion.div>
    </section>
  );
}
