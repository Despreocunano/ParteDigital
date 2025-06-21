import { Baby, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';

interface KidsAndPetsProps {
  acceptsKids: boolean;
  acceptsPets: boolean;
  bgColor?: string;
  className?: string;
}

export function KidsAndPets({ acceptsKids, acceptsPets, bgColor = '#540A17', className = '' }: KidsAndPetsProps) {
  if (!acceptsKids && !acceptsPets) return null;

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

  const content = (
    <div className={`grid ${acceptsKids && acceptsPets ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-8`}>
      {acceptsKids && (
        <motion.div 
          className="bg-[#C5A07F] rounded-xl p-8 text-center border border-[#CFD6BA]/20"
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15 }}
          >
            <Baby className="w-8 h-8 text-[#c8a784]" />
          </motion.div>
          <h3 className="text-3xl font-fraunces mb-4 text-white">Los Niños Bienvenidos</h3>
          <p className="text-[#540B17]/80 text-lg leading-relaxed font-sans">
            Los más pequeños de la familia son bienvenidos a nuestra celebración
          </p>
        </motion.div>
      )}
      {acceptsPets && (
        <motion.div 
          className="bg-[#C5A07F] rounded-xl p-8 text-center border border-[#CFD6BA]/20"
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15 }}
          >
            <PawPrint className="w-8 h-8 text-[#c8a784]" />
          </motion.div>
          <h3 className="text-3xl font-fraunces mb-4 text-white">Pet Friendly</h3>
          <p className="text-[#540B17]/80 text-lg leading-relaxed font-sans">
            Tu mascota es parte de la familia y es bienvenida a nuestra celebración
          </p>
        </motion.div>
      )}
    </div>
  );

  return (
    <section className={`p-24 px-4 ${className}`}>
      <motion.div 
        className="max-w-4xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.div className="text-center mb-12" variants={item}>
          <h2 className="text-5xl md:text-6xl font-fraunces text-white mb-2">
            Todos son bienvenidos
          </h2>
        </motion.div>
        {content}
      </motion.div>
    </section>
  );
} 