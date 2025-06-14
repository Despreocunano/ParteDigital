import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { InfoModal } from '../../../shared/InfoModal';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import divider from '../assets/divider_2.svg'
import rosas from '../assets/Grupo03.webp'

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
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!userId || selectedTracks.length === 0) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('song_recommendations')
        .insert(
          selectedTracks.map(track => ({
            user_id: userId,
            song_name: track.name,
            artist_name: track.artist
          }))
        );

      if (error) throw error;

      toast.success('¡Gracias por tus sugerencias!');
      setShowMusicModal(false);
      setSelectedTracks([]);
    } catch (error) {
      console.error('Error saving songs:', error);
      toast.error('Error al guardar las canciones');
    } finally {
      setIsSubmitting(false);
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
            <img src={divider} alt="Divider" className="mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-serif font-black text-[#995B70] mb-2">
              Información de la Fiesta
            </h2>
            <p className="text-xl text-center text-[#8D6E63]">
            Hagamos juntos una fiesta épica. Aquí algunos detalles a tener en cuenta.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#F8BBD9]/50 shadow-lg relative"
              variants={item}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.img 
                src={rosas} 
                alt="Rosas decorativas" 
                className="absolute -top-16 -left-32 w-64 h-64 object-contain"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              />
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
                <Shirt className="w-16 h-16 text-[#BC913B]" />
              </motion.div>
              <h3 className="text-xl font-serif mb-4 text-[#2D1B69]">Una orientación para tu vestuario</h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowDressCodeModal(true)}
                  variant="secondary"
                  className="w-full border-[#BF0D78] text-[#BF0D78] hover:bg-[#9a5b71] hover:border-[#9a5b71] hover:text-white"
                >
                  Ver más
                </Button>
              </motion.div>
            </motion.div>
            
            {musicInfo && (
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
                  <Music2 className="w-16 h-16 text-[#BC913B]" />
                </motion.div>
                <h3 className="text-xl font-serif mb-4 text-[#2D1B69]">¿Cuál es la canción que no debe faltar en la playlist de la fiesta?</h3>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowMusicModal(true)}
                    variant="secondary"
                    className="w-full border-[#BF0D78] text-[#BF0D78] hover:bg-[#9a5b71] hover:border-[#9a5b71] hover:text-white"
                  >
                    Sugerir Canciones
                  </Button>
                </motion.div>
              </motion.div>
            )}
            
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
                <Lightbulb className="w-16 h-16 text-[#BC913B]" />
              </motion.div>
              <h3 className="text-xl font-serif mb-4 text-[#2D1B69]">Información adicional para tener en cuenta</h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowTipsModal(true)}
                  variant="secondary"
                  className="w-full border-[#BF0D78] text-[#BF0D78] hover:bg-[#9a5b71] hover:border-[#9a5b71] hover:text-white"
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
        iconColor="#BC913B"
      >
        <div className="space-y-6">
          <p className="text-[#8D6E63] text-lg leading-relaxed">
            ¿Cuál es la canción que no debe faltar en la playlist de la fiesta?
          </p>
          <SpotifySearch
            onSelect={(track) => {
              if (!selectedTracks.find(t => t.id === track.id)) {
                setSelectedTracks([...selectedTracks, track]);
              }
            }}
            onRemove={(trackId) => setSelectedTracks(selectedTracks.filter(t => t.id !== trackId))}
            selectedTracks={selectedTracks}
            maxTracks={2}
          />
          {selectedTracks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#2D1B69]">Canciones seleccionadas:</h3>
              <div className="space-y-2">
                {selectedTracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between bg-white/50 p-3 rounded-lg border border-[#F8BBD9]/30"
                  >
                    <div className="flex items-center space-x-3">
                      {track.albumCover && (
                        <img
                          src={track.albumCover}
                          alt={track.name}
                          className="w-10 h-10 rounded"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-[#2D1B69]">{track.name}</p>
                        <p className="text-sm text-[#8D6E63]">{track.artist}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTracks(selectedTracks.filter(t => t.id !== track.id))}
                      className="text-[#8D6E63] hover:text-[#2D1B69]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#E91E63] hover:bg-[#C2185B] text-white"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Sugerencias'}
              </Button>
            </div>
          )}
        </div>
      </InfoModal>

      {/* Dress Code Modal */}
      <InfoModal
        isOpen={showDressCodeModal}
        onClose={() => setShowDressCodeModal(false)}
        title="Dress Code"
        icon={Shirt}
        iconColor="#BC913B"
      >
        <p className="text-[#8D6E63] text-lg leading-relaxed whitespace-pre-wrap">
          {dresscode}
        </p>
      </InfoModal>

      {/* Tips Modal */}
      <InfoModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title="Información Adicional"
        icon={Lightbulb}
        iconColor="#BC913B"
      >
        <p className="text-[#8D6E63] text-lg leading-relaxed whitespace-pre-wrap">
          {tips}
        </p>
      </InfoModal>
    </>
  );
}