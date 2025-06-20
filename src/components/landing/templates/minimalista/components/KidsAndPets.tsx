import { Baby, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className={`grid ${acceptsKids && acceptsPets ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-8`}>
      {acceptsKids && (
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#333333]/20"
          variants={item}
        >
          <motion.div 
            className="w-24 h-24 bg-[#333333]/90 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15 }}
          >
            <Baby className="w-16 h-16 text-white" />
          </motion.div>
          <h3 className="text-2xl font-poppins mb-4 text-[#B87600]">Los Niños Bienvenidos</h3>
          <p className="text-[#8D6E63] text-lg leading-relaxed font-rubik">
            Los más pequeños de la familia son bienvenidos a nuestra celebración
          </p>
        </motion.div>
      )}
      {acceptsPets && (
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#333333]/20"
          variants={item}
        >
          <motion.div 
            className="w-24 h-24 bg-[#333333]/90 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15 }}
          >
            <PawPrint className="w-16 h-16 text-white" />
          </motion.div>
          <h3 className="text-2xl font-poppins mb-4 text-[#B87600]">Pet Friendly</h3>
          <p className="text-[#8D6E63] text-lg leading-relaxed font-rubik">
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
          <h2 className="text-4xl md:text-5xl font-poppins text-[#B87600] mb-6">
            Todos son bienvenidos
          </h2>
        </motion.div>
        {content}
      </motion.div>
    </section>
  );
} 