import { Baby, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';
import { Divider } from './Divider';

interface KidsAndPetsProps {
  acceptsKids: boolean;
  acceptsPets: boolean;
  className?: string;
}

export function KidsAndPets({ acceptsKids, acceptsPets, className = '' }: KidsAndPetsProps) {
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
    <div className={`grid ${acceptsKids && acceptsPets ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-8 ${className}`}>
      {acceptsKids && (
        <motion.div 
          className="bg-[#5C3229] rounded-xl p-8 text-center border border-[#DF9434]/20"
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="w-16 h-16 bg-[#DF9434]/20 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15 }}
          >
            <Baby className="w-8 h-8 text-[#DF9434]" />
          </motion.div>
          <h3 className="text-xl font-serif mb-4 text-[#DF9434]">Los Niños Bienvenidos</h3>
          <p className="text-[#DF9434]/80 text-lg leading-relaxed">
            Los más pequeños de la familia son bienvenidos a nuestra celebración
          </p>
        </motion.div>
      )}
      {acceptsPets && (
        <motion.div 
          className="bg-[#5C3229] rounded-xl p-8 text-center border border-[#DF9434]/20"
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="w-16 h-16 bg-[#DF9434]/20 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15 }}
          >
            <PawPrint className="w-8 h-8 text-[#DF9434]" />
          </motion.div>
          <h3 className="text-xl font-serif mb-4 text-[#DF9434]">Pet Friendly</h3>
          <p className="text-[#DF9434]/80 text-lg leading-relaxed">
            Tu mascota es parte de la familia y es bienvenida a nuestra celebración
          </p>
        </motion.div>
      )}
    </div>
  );

  return (
    <section className="pb-24 px-4">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.div className="text-center mb-12" variants={item}>
          <h2 className="text-3xl md:text-4xl font-serif text-[#DF9434]">
            Todos son bienvenidos
          </h2>
          <Divider className="mt-8" />
        </motion.div>
        {content}
      </motion.div>
    </section>
  );
} 