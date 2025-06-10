import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X, LucideIcon } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Divider } from './Divider';

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
  dresscode,
  musicInfo,
  tips,
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
      toast.error('Error al guardar la canción');
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
    icon: LucideIcon;
  }) => {
    if (!isOpen) return null;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C2127]/95 backdrop-blur-sm"
      >
        <div 
          className="relative w-full max-w-2xl px-8 py-12 text-center text-[#D4B572]"
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#D4B572]/30" />
          <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-[#D4B572]/30" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-[#D4B572]/30" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-[#D4B572]/30" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#D4B572]/10 hover:bg-[#D4B572]/20 transition-colors z-10"
          >
            <X className="w-5 h-5 text-[#D4B572]" />
          </button>

          <div className="space-y-8">
            <div className="w-16 h-16 bg-[#D4B572]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon className="w-8 h-8 text-[#D4B572]" />
            </div>
            <h2 className="text-3xl font-serif">{title}</h2>
            <p className="text-[#D4B572]/80 text-lg leading-relaxed whitespace-pre-wrap">
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
            <h2 className="text-3xl md:text-4xl font-serif text-[#D4B572]">
              Información de la Fiesta
            </h2>
            <Divider className="mt-8" />
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
                <Shirt className="w-8 h-8 text-[#D4B572]" />
              </motion.div>
              <h3 className="text-xl font-serif mb-4 text-[#D4B572]">Una orientación para tu vestuario</h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowDressCodeModal(true)}
                  variant="secondary"
                  className="w-full"
                >
                  Ver más
                </Button>
              </motion.div>
            </motion.div>
            
            {musicInfo && (
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
                  <Music2 className="w-8 h-8 text-[#D4B572]" />
                </motion.div>
                <h3 className="text-xl font-serif mb-4 text-[#D4B572]">¿Cuál es la canción que no debe faltar en la playlist de la fiesta?</h3>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowMusicModal(true)}
                    variant="secondary"
                    className="w-full"
                  >
                    Sugerir Canciones
                  </Button>
                </motion.div>
              </motion.div>
            )}
            
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
                <Lightbulb className="w-8 h-8 text-[#D4B572]" />
              </motion.div>
              <h3 className="text-xl font-serif mb-4 text-[#D4B572]">Información adicional para tener en cuenta</h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowTipsModal(true)}
                  variant="secondary"
                  className="w-full"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C2127]/95 backdrop-blur-sm"
        >
          <div 
            className="relative w-full max-w-2xl px-8 py-12 text-center text-[#D4B572]"
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#D4B572]/30" />
            <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-[#D4B572]/30" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-[#D4B572]/30" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-[#D4B572]/30" />

            <button
              onClick={() => setShowMusicModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#D4B572]/10 hover:bg-[#D4B572]/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-[#D4B572]" />
            </button>

            <div className="space-y-8">
              <div className="w-16 h-16 bg-[#D4B572]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music2 className="w-8 h-8 text-[#D4B572]" />
              </div>
              <h2 className="text-3xl font-serif">Sugerir Canciones</h2>
              <p className="text-[#D4B572]/80">
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
        content={dresscode || 'Formal'}
        icon={Shirt}
      />

      {/* Tips Modal */}
      <InfoModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title="Información Adicional"
        content={tips || 'La celebración será al aire libre'}
        icon={Lightbulb}
      />
    </>
  );
}