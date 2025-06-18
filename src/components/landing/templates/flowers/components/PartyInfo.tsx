import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { InfoModal } from '../../../shared/InfoModal';

interface Track {
  id: string;
  name: string;
  artist: string;
  albumCover?: string;
}

interface PartyInfoProps {
  dresscode: string;
  musicInfo?: string;
  tips: string;
  className?: string;
  userId?: string;
}

export function PartyInfo({
  dresscode = 'Formal',
  musicInfo,
  tips = 'La celebración será al aire libre',
  className = '',
  userId
}: PartyInfoProps) {
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [showDressCodeModal, setShowDressCodeModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);

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
    <>
      <motion.section 
        className={`py-24 px-4 ${className}`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={item}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[#8B4513]">
              Información de la Fiesta
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center border border-[#E8A87C]/30 shadow-lg"
              variants={item}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="w-16 h-16 bg-[#E8A87C]/20 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ rotate: 15 }}
              >
                <Shirt className="w-8 h-8 text-[#8B4513]" />
              </motion.div>
              <h3 className="text-xl font-serif mb-4 text-[#8B4513]">Una orientación para tu vestuario</h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowDressCodeModal(true)}
                  variant="secondary"
                  className="w-full border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                >
                  Ver más
                </Button>
              </motion.div>
            </motion.div>
            
            {musicInfo && (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center border border-[#E8A87C]/30 shadow-lg"
                variants={item}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-[#E8A87C]/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ rotate: 15 }}
                >
                  <Music2 className="w-8 h-8 text-[#8B4513]" />
                </motion.div>
                <h3 className="text-xl font-serif mb-4 text-[#8B4513]">¿Cuál es la canción que no debe faltar en la playlist de la fiesta?</h3>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowMusicModal(true)}
                    variant="secondary"
                    className="w-full border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                  >
                    Sugerir Canciones
                  </Button>
                </motion.div>
              </motion.div>
            )}
            
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center border border-[#E8A87C]/30 shadow-lg"
              variants={item}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="w-16 h-16 bg-[#E8A87C]/20 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ rotate: 15 }}
              >
                <Lightbulb className="w-8 h-8 text-[#8B4513]" />
              </motion.div>
              <h3 className="text-xl font-serif mb-4 text-[#8B4513]">Información adicional para tener en cuenta</h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowTipsModal(true)}
                  variant="secondary"
                  className="w-full border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                >
                  Ver más
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Music Modal */}
      <InfoModal
        isOpen={showMusicModal}
        onClose={() => setShowMusicModal(false)}
        title="Sugerir Canciones"
        icon={Music2}
        iconColor="#E8A87C"
        overlayColor="#FDF8F5"
      >
        <div className="space-y-6">
          <SpotifySearch
            userId={userId}
            maxTracks={2}
          />
        </div>
      </InfoModal>

      {/* Dress Code Modal */}
      <InfoModal
        isOpen={showDressCodeModal}
        onClose={() => setShowDressCodeModal(false)}
        title="Dress Code"
        icon={Shirt}
        iconColor="#E8A87C"
        overlayColor="#FDF8F5"
      >
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {dresscode}
        </p>
      </InfoModal>

      {/* Tips Modal */}
      <InfoModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title="Información Adicional"
        icon={Lightbulb}
        iconColor="#E8A87C"
        overlayColor="#FDF8F5"
      >
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {tips}
        </p>
      </InfoModal>
    </>
  );
}