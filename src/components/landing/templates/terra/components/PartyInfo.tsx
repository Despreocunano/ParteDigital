import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Divider } from './Divider';
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
            <h2 className="text-3xl md:text-4xl font-serif text-[#FAB765]">
              Información de la Fiesta
            </h2>
            <Divider className="mt-8" />
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-[#47261F] rounded-xl p-8 text-center border border-[#DF9434]/30 shadow-lg"
              variants={item}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="w-16 h-16 bg-[#DF9434]/20 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ rotate: 15 }}
              >
                <Shirt className="w-8 h-8 text-[#FAB765]" />
              </motion.div>
              <h3 className="text-xl font-serif mb-4 text-[#FAB765]">Una orientación para tu vestuario</h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowDressCodeModal(true)}
                  variant="secondary"
                  className="w-full border-[#DF9434] text-[#FAB765] hover:bg-[#DF9434] hover:text-[#47261F]"
                >
                  Ver más
                </Button>
              </motion.div>
            </motion.div>
            
            {musicInfo && (
              <motion.div 
                className="bg-[#47261F] rounded-xl p-8 text-center border border-[#DF9434]/30 shadow-lg"
                variants={item}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-[#DF9434]/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ rotate: 15 }}
                >
                  <Music2 className="w-8 h-8 text-[#FAB765]" />
                </motion.div>
                <h3 className="text-xl font-serif mb-4 text-[#FAB765]">¿Cuál es la canción que no debe faltar en la playlist de la fiesta?</h3>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowMusicModal(true)}
                    variant="secondary"
                    className="w-full border-[#DF9434] text-[#FAB765] hover:bg-[#DF9434] hover:text-[#47261F]"
                  >
                    Sugerir Canciones
                  </Button>
                </motion.div>
              </motion.div>
            )}
            
            <motion.div 
              className="bg-[#47261F] rounded-xl p-8 text-center border border-[#DF9434]/30 shadow-lg"
              variants={item}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="w-16 h-16 bg-[#DF9434]/20 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ rotate: 15 }}
              >
                <Lightbulb className="w-8 h-8 text-[#FAB765]" />
              </motion.div>
              <h3 className="text-xl font-serif mb-4 text-[#FAB765]">Información adicional para tener en cuenta</h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowTipsModal(true)}
                  variant="secondary"
                  className="w-full border-[#DF9434] text-[#FAB765] hover:bg-[#DF9434] hover:text-[#47261F]"
                >
                  Ver más
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <InfoModal
        isOpen={showDressCodeModal}
        onClose={() => setShowDressCodeModal(false)}
        title="Dress Code"
        icon={Shirt}
        iconColor="#FAB765"
        overlayColor="#46261F"
      >
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {dresscode}
        </p>
      </InfoModal>

      <InfoModal
        isOpen={showMusicModal}
        onClose={() => setShowMusicModal(false)}
        title="Sugerir Canciones"
        icon={Music2}
        iconColor="#FAB765"
        overlayColor="#46261F"
      >
        <div className="space-y-6">
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
              <h3 className="text-xl font-serif">Canciones seleccionadas:</h3>
              <div className="space-y-2">
                {selectedTracks.map((track) => (
                  <div 
                    key={track.id}
                    className="flex items-center justify-between bg-white/50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center space-x-4">
                      {track.albumCover && (
                        <img 
                          src={track.albumCover} 
                          alt={track.name}
                          className="w-12 h-12 rounded"
                        />
                      )}
                      <div className="text-left">
                        <p className="font-medium">{track.name}</p>
                        <p className="text-gray-600 text-sm">{track.artist}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTracks(selectedTracks.filter(t => t.id !== track.id))}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#DF9434] hover:bg-[#C8851F] text-[#47261F]"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Sugerencias'}
              </Button>
            </div>
          )}
        </div>
      </InfoModal>

      <InfoModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title="Información Adicional"
        icon={Lightbulb}
        iconColor="#FAB765"
        overlayColor="#46261F"
      >
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {tips}
        </p>
      </InfoModal>
    </>
  );
}