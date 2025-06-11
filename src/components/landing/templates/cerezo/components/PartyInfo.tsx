import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import divider from '../assets/divider_2.svg'
import rosas from '../assets/Grupo03.webp'
import modal from '../assets/modal.svg'


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

  const InfoModal = ({ 
    isOpen, 
    onClose, 
    title, 
    content,
    icon: Icon
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    content: string;
    icon: any;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF3F4]">
        <div className="relative w-full max-w-2xl px-12 py-12 text-center text-[#2D1B69]">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-24 h-24">
            <img src={modal} />
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 scale-x-[-1]">
            <img src={modal} />
          </div>
          <div className="absolute bottom-0 left-0 w-24 h-24 scale-y-[-1]">
            <img src={modal} />
          </div>
          <div className="absolute bottom-0 right-0 w-24 h-24 scale-[-1]">
            <img src={modal} />
          </div>

          <button
            onClick={onClose}
            className="absolute top-12 right-12 w-8 h-8 flex items-center justify-center rounded-full bg-[#F8BBD9]/20 hover:bg-[#F8BBD9]/40 transition-colors z-20"
          >
            <X className="w-5 h-5 text-[#2D1B69]" />
          </button>

          <div className="space-y-8">
            <div className="w-24 h-24 bg-[#F8BBD9]/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon className="w-16 h-16 text-[#BC913B]" />
            </div>
            <h2 className="text-3xl font-serif">{title}</h2>
            <p className="text-[#8D6E63] text-lg leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </div>
      </div>
    );
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
      {showMusicModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF3F4]"
        >
          <div 
            className="relative w-full max-w-2xl px-12 py-12 text-center text-[#2D1B69]"
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-24 h-24">
              <img src={modal} />
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 scale-x-[-1]">
              <img src={modal} />
            </div>
            <div className="absolute bottom-0 left-0 w-24 h-24 scale-y-[-1]">
              <img src={modal} />
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 scale-[-1]">
              <img src={modal} />
            </div>

            <button
              onClick={() => setShowMusicModal(false)}
              className="absolute top-12 right-12 w-8 h-8 flex items-center justify-center rounded-full bg-[#F8BBD9]/20 hover:bg-[#F8BBD9]/40 transition-colors z-20"
            >
              <X className="w-5 h-5 text-[#2D1B69]" />
            </button>

            <div className="space-y-8">
              <div className="w-24 h-24 bg-[#F8BBD9]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music2 className="w-16 h-16 text-[#BC913B]" />
              </div>
              <h2 className="text-3xl font-serif">Sugerir Canciones</h2>
              <p className="text-[#8D6E63]">
                Ayúdanos a crear la playlist perfecta para nuestra fiesta
              </p>

              <div className="space-y-6">
                <SpotifySearch
                  selectedTracks={selectedTracks}
                  onSelect={(track) => setSelectedTracks([...selectedTracks, track])}
                  onRemove={(trackId) => setSelectedTracks(selectedTracks.filter(t => t.id !== trackId))}
                  maxTracks={2}
                />

                <Button
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  disabled={selectedTracks.length === 0}
                  className="bg-[#E91E63] hover:bg-[#C2185B] text-white"
                >
                  Guardar Canciones
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dress Code Modal */}
      <InfoModal
        isOpen={showDressCodeModal}
        onClose={() => setShowDressCodeModal(false)}
        title="Código de Vestimenta"
        content={dresscode}
        icon={Shirt}
      />

      {/* Tips Modal */}
      <InfoModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title="Información Adicional"
        content={tips}
        icon={Lightbulb}
      />
    </>
  );
}