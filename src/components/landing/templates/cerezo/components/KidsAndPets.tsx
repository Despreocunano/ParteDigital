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
    <div className={`grid ${acceptsKids && acceptsPets ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-8 ${className}`}>
      {acceptsKids && (
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#F8BBD9]/50 shadow-lg relative"
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute top-4 right-4">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="2" fill="#F8BBD9" opacity="0.6"/>
              <circle cx="8" cy="8" r="1.5" fill="#FCE4EC"/>
              <circle cx="12" cy="8" r="1.5" fill="#FCE4EC"/>
              <circle cx="8" cy="12" r="1.5" fill="#FCE4EC"/>
              <circle cx="12" cy="12" r="1.5" fill="#FCE4EC"/>
            </svg>
          </div>
          <motion.div 
            className="w-24 h-24 bg-[#F8BBD9]/30 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15 }}
          >
            <Baby className="w-16 h-16 text-[#BC913B]" />
          </motion.div>
          <h3 className="text-3xl font-sans mb-4 text-[#985B70]">Los niños bienvenidos</h3>
          <p className="text-[#985B70] text-xl leading-relaxed">
            Los más pequeños de la familia son bienvenidos a nuestra celebración
          </p>
        </motion.div>
      )}
      {acceptsPets && (
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#F8BBD9]/50 shadow-lg relative"
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute top-4 right-4">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="2" fill="#F8BBD9" opacity="0.6"/>
              <circle cx="8" cy="8" r="1.5" fill="#FCE4EC"/>
              <circle cx="12" cy="8" r="1.5" fill="#FCE4EC"/>
              <circle cx="8" cy="12" r="1.5" fill="#FCE4EC"/>
              <circle cx="12" cy="12" r="1.5" fill="#FCE4EC"/>
            </svg>
          </div>
          <motion.div 
            className="w-24 h-24 bg-[#F8BBD9]/30 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15 }}
          >
            <PawPrint className="w-16 h-16 text-[#BC913B]" />
          </motion.div>
          <h3 className="text-3xl font-sans mb-4 text-[#985B70]">Pet Friendly</h3>
          <p className="text-[#985B70] text-xl leading-relaxed">
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
          <h2 className="text-4xl md:text-5xl font-serif font-black text-[#995B70] mb-6">
            Todos son bienvenidos
          </h2>
        </motion.div>
        {content}
      </motion.div>
    </section>
  );
} 