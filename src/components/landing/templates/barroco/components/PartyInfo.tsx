import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { InfoModal } from '../../../shared/InfoModal';
import { motion } from 'framer-motion';

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
            <h2 className="text-4xl md:text-6xl font-fraunces font-extrabold text-[#B87600] mb-4">
              Información de la Fiesta
            </h2>
            <p className="text-xl font-rubik text-[#8D6E63]">
            Hagamos juntos una fiesta épica. Aquí algunos detalles a tener en cuenta.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-[#FCF3E8] backdrop-blur-sm rounded-2xl p-8 text-center border border-[#333333]/20"
              variants={item}
            >
              <motion.div 
                className="w-24 h-24 bg-[#08202B]/90 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ rotate: 15 }}
              >
                <Shirt className="w-16 h-16 text-white" />
              </motion.div>
              <h3 className="text-[#8D6E63] text-lg leading-relaxed font-rubik mb-6">Una orientación para que elijas el vestuario</h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowDressCodeModal(true)}
                  className="bg-[#C8A784] hover:bg-white text-white hover:text-[#C8A784] px-6 py-2 w-full rounded-full text-base font-rubik"
                >
                  Ver más
                </Button>
              </motion.div>
            </motion.div>
            
            {musicInfo && (
              <motion.div 
                className="bg-[#FCF3E8] backdrop-blur-sm rounded-2xl p-8 text-center border border-[#333333]/20"
                variants={item}
              >
                <motion.div 
                  className="w-24 h-24 bg-[#08202B]/90 rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ rotate: 15 }}
                >
                  <Music2 className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-[#8D6E63] text-lg leading-relaxed font-rubik mb-6">¿Cuál es la canción que no debe faltar en la playlist de la fiesta?</h3>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowMusicModal(true)}
                    className="bg-[#C8A784] hover:bg-white text-white hover:text-[#C8A784] px-6 py-2 w-full rounded-full text-base font-rubik"
                  >
                    Sugerir Canciones
                  </Button>
                </motion.div>
              </motion.div>
            )}
            
            <motion.div 
              className="bg-[#FCF3E8] backdrop-blur-sm rounded-2xl p-8 text-center border border-[#333333]/20"
              variants={item}
            >
              <motion.div 
                className="w-24 h-24 bg-[#08202B]/90 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ rotate: 15 }}
              >
                <Lightbulb className="w-16 h-16 text-white" />
              </motion.div>
              <h3 className="text-[#8D6E63] text-lg leading-relaxed font-rubik mb-6">Información adicional para tener en cuenta</h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowTipsModal(true)}
                  className="bg-[#C8A784] hover:bg-white text-white hover:text-[#C8A784] px-6 py-2 w-full rounded-full text-base font-rubik"
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
        iconColor="#333333"
      >
        <div className="space-y-6">
          <p className="text-[#333333] font-rubik text-lg leading-relaxed">
            ¿Cuál es la canción que no debe faltar en la playlist de la fiesta?
          </p>
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
        iconColor="#333333"
      >
        <p className="text-[#333333] font-rubik text-lg leading-relaxed whitespace-pre-wrap">
          {dresscode}
        </p>
      </InfoModal>

      {/* Tips Modal */}
      <InfoModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title="Información Adicional"
        icon={Lightbulb}
        iconColor="#333333"
      >
        <p className="text-[#333333] font-rubik text-lg leading-relaxed whitespace-pre-wrap">
          {tips}
        </p>
      </InfoModal>
    </>
  );
}