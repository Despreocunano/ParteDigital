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

  return (
    <motion.section 
      className={`pb-24 px-4 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      <motion.div 
        className="max-w-4xl mx-auto text-center"
        variants={item}
      >
        
        <h2 className="text-3xl md:text-4xl font-serif mb-8 text-[#8B4513]">Todos son bienvenidos</h2>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {acceptsKids && (
            <motion.div
              className="bg-[#FDF8F5] rounded-xl p-8 shadow-lg border border-[#E8A87C]/20 w-full md:w-[400px]"
              variants={item}
            >
              <h3 className="text-2xl font-serif mb-2 text-[#8B4513]">Los Niños Bienvenidos</h3>
              <div className="bg-[#E8A87C]/10 rounded-lg p-3 h-[72px] flex items-center justify-center">
                <p className="text-[#8B4513] text-lg">
                  Los niños son bienvenidos a nuestra celebración
                </p>
              </div>
            </motion.div>
          )}

          {acceptsPets && (
            <motion.div
              className="bg-[#FDF8F5] rounded-xl p-8 shadow-lg border border-[#E8A87C]/20 w-full md:w-[400px]"
              variants={item}
            >
              <h3 className="text-2xl font-serif mb-2 text-[#8B4513]">Pet Friendly</h3>
              <div className="bg-[#E8A87C]/10 rounded-lg p-3 h-[72px] flex items-center justify-center">
                <p className="text-[#8B4513] text-lg">
                  Tu mascota es bienvenida a nuestra celebración
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
} 