import { Instagram } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { motion } from 'framer-motion';
import divider from '../assets/divider.svg'


interface SocialProps {
  hashtag?: string;
  instagramPosts?: Array<{
    id: string;
    imageUrl: string;
    caption?: string;
  }>;
  className?: string;
}

export function Social({ hashtag, instagramPosts = [], className = '' }: SocialProps) {
  const handleInstagramClick = () => {
    window.open(`https://www.instagram.com/explore/tags/${hashtag?.toLowerCase()}`, '_blank');
  };

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
      className={`py-24 px-4 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.div variants={item}>
          <div className="w-16 h-16 bg-[#F8BBD9]/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Instagram className="w-8 h-8 text-[#2D1B69]" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-black text-[#995B70] mb-6">Comparte tus Fotos</h2>
          
          <img src={divider} alt="Divider" className="mx-auto mb-8" />

        </motion.div>
        
        <motion.div 
          className="max-w-xl mx-auto mb-12 space-y-6"
          variants={item}
        >
          <div className="inline-block bg-white/90 backdrop-blur-sm border border-[#F8BBD9]/50 rounded-full px-6 py-3 relative">
            {/* Cherry blossom decoration */}
            <div className="absolute -top-2 -right-2">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="2" fill="#F8BBD9" opacity="0.6"/>
                <circle cx="8" cy="8" r="1.5" fill="#FCE4EC"/>
                <circle cx="12" cy="8" r="1.5" fill="#FCE4EC"/>
                <circle cx="8" cy="12" r="1.5" fill="#FCE4EC"/>
                <circle cx="12" cy="12" r="1.5" fill="#FCE4EC"/>
              </svg>
            </div>
            <p className="text-2xl font-light text-[#2D1B69]">
              #{hashtag}
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleInstagramClick}
              className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white"
              leftIcon={<Instagram className="w-5 h-5" />}
            >
              Ver en Instagram
            </Button>
          </motion.div>
        </motion.div>
        
        {instagramPosts.length > 0 && (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={container}
          >
            {instagramPosts.map((post, index) => (
              <motion.div 
                key={post.id}
                className="aspect-square overflow-hidden rounded-xl border border-[#F8BBD9]/30"
                variants={item}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption || 'Instagram post'}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}