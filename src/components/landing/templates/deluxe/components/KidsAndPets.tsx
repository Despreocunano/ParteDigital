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
          className="bg-[#1C2127] rounded-xl p-8 text-center border border-[#D4B572]/20"
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="w-16 h-16 bg-[#D4B572]/20 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15 }}
          >
            <Baby className="w-8 h-8 text-[#D4B572]" />
          </motion.div>
          <h3 className="text-xl font-serif mb-4 text-[#D4B572]">Niños Bienvenidos</h3>
          <p className="text-[#D4B572]/80 text-sm leading-relaxed">
            Los más pequeños de la familia son bienvenidos a nuestra celebración
          </p>
        </motion.div>
      )}
      {acceptsPets && (
        <motion.div 
          className="bg-[#1C2127] rounded-xl p-8 text-center border border-[#D4B572]/20"
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="w-16 h-16 bg-[#D4B572]/20 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15 }}
          >
            <PawPrint className="w-8 h-8 text-[#D4B572]" />
          </motion.div>
          <h3 className="text-xl font-serif mb-4 text-[#D4B572]">Pet Friendly</h3>
          <p className="text-[#D4B572]/80 text-sm leading-relaxed">
            Tu mascota es parte de la familia y es bienvenida
          </p>
        </motion.div>
      )}
    </div>
  );

  return (
    <section className="py-24 px-4 bg-[#2F3E46]">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.div className="text-center mb-12" variants={item}>
          <h2 className="text-3xl md:text-4xl font-serif text-[#D4B572]">
            Nuestra Familia
          </h2>
          <Divider className="mt-8" />
        </motion.div>
        {content}
      </motion.div>
    </section>
  );
} 