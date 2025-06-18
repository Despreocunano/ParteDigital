import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { InfoModal } from '../../../shared/InfoModal';
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
            <h2 className="text-2xl md:text-3xl font-serif text-[#D4B572]">
              Información de la Fiesta
            </h2>
            <Divider className="mt-8" />
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-[#23342D] rounded-xl p-8 text-center border border-[#D4B572]/20"
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
                  className="w-full font-sans"
                >
                  Ver más
                </Button>
              </motion.div>
            </motion.div>
            
            {musicInfo && (
              <motion.div 
                className="bg-[#23342D] rounded-xl p-8 text-center border border-[#D4B572]/20"
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
                    className="w-full font-sans"
                  >
                    Sugerir Canciones
                  </Button>
                </motion.div>
              </motion.div>
            )}
            
            <motion.div 
              className="bg-[#23342D] rounded-xl p-8 text-center border border-[#D4B572]/20"
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
                  className="w-full font-sans"
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
      >
        <div className="space-y-6">
          <p className="text-gray-600 text-lg leading-relaxed">
            ¿Cuál es la canción que no debe faltar en la playlist de la fiesta?
          </p>
          <SpotifySearch
            userId={userId}
            maxTracks={2}
            onTracksChange={(tracks) => setSelectedTracks(tracks)}
          />
          {selectedTracks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Canciones seleccionadas:</h3>
              <div className="space-y-2">
                {selectedTracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
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
                        <p className="text-sm font-medium text-gray-900">{track.name}</p>
                        <p className="text-sm text-gray-500">{track.artist}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTracks(selectedTracks.filter(t => t.id !== track.id))}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
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
      >
        <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
          {dresscode}
        </p>
      </InfoModal>

      {/* Tips Modal */}
      <InfoModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title="Información Adicional"
        icon={Lightbulb}
      >
        <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
          {tips}
        </p>
      </InfoModal>
    </>
  );
}