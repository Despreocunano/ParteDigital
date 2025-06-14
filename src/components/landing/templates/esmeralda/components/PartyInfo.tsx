import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import rosas from '../assets/Grupo03.webp'
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
            <h2 className="text-5xl md:text-6xl font-parisienne text-white mb-2">
              Información de la Fiesta
            </h2>
            <p className="text-xl text-center text-[#cfd6bb]">
            Hagamos juntos una fiesta épica. Aquí algunos detalles a tener en cuenta.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Dress Code (con imagen decorativa) */}
            <div className="relative">
              {/* Imagen decorativa detrás */}
              <motion.img 
                src={rosas} 
                alt="Rosas decorativas" 
                className="absolute -top-16 -left-32 w-64 h-64 object-contain z-0 pointer-events-none"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              />
              {/* Card */}
              <motion.div 
                className="bg-[#00534E] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[450px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-5xl font-parisienne text-white">Dress Code</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Shirt className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-xl font-lora text-[#cfd6bb] font-parisienne mb-4">Una orientación para que elijas tu mejor vestuario</h3>
                <Button
                  onClick={() => setShowDressCodeModal(true)}
                  variant="secondary"
                  className="w-full rounded-full bg-[#CFD6BA] text-[#002d27] uppercase hover:bg-[#012D27] hover:border-[#012D27] hover:text-white mt-4"
                >
                  Ver más
                </Button>
              </motion.div>
            </div>
            
            {/* Card 2: Música (sin imagen decorativa) */}
            <div className="relative">
              <motion.div 
                className="bg-[#00534E] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[450px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-5xl font-parisienne text-white">Música</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Music2 className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-xl font-lora text-[#cfd6bb] font-parisienne mb-4">¿Cuál es la canción que no debe faltar en la playlist de la fiesta?</h3>
                <Button
                  onClick={() => setShowMusicModal(true)}
                  variant="secondary"
                  className="w-full rounded-full bg-[#CFD6BA] text-[#002d27] uppercase hover:bg-[#012D27] hover:border-[#012D27] hover:text-white mt-4"
                >
                  Sugerir canción
                </Button>
              </motion.div>
            </div>
            
            {/* Card 3: Info Adicional (sin imagen decorativa) */}
            <div className="relative">
              <motion.div 
                className="bg-[#00534E] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[450px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-5xl font-parisienne text-white">Info Adicional</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Lightbulb className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-xl font-lora text-[#cfd6bb] font-parisienne mb-4">Información adicional para tener en cuenta</h3>
                <Button
                  onClick={() => setShowTipsModal(true)}
                  variant="secondary"
                  className="w-full rounded-full bg-[#CFD6BA] text-[#002d27] uppercase hover:bg-[#012D27] hover:border-[#012D27] hover:text-white mt-4"
                >
                  Ver más
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Music Modal */}
      <InfoModal
        isOpen={showMusicModal}
        onClose={() => setShowMusicModal(false)}
        title="Sugerir Canciones"
        icon={Music2}
        iconColor="#CFD6BA"
        overlayColor="#012D27"
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
              <h3 className="text-xl font-lora text-[#CFD6BA]">Canciones seleccionadas:</h3>
              <div className="space-y-2">
                {selectedTracks.map((track) => (
                  <div 
                    key={track.id}
                    className="flex items-center justify-between bg-[#00534E]/50 rounded-lg p-4 border border-[#CFD6BA]/20"
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
                        <p className="font-medium text-[#CFD6BA]">{track.name}</p>
                        <p className="text-[#CFD6BA]/60 text-sm">{track.artist}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTracks(selectedTracks.filter(t => t.id !== track.id))}
                      className="text-[#CFD6BA]/40 hover:text-[#CFD6BA]/60"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#CFD6BA] text-[#012D27] hover:bg-[#012D27] hover:text-[#CFD6BA] rounded-full border hover:border-[#CFD6BA]"
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
        title="Código de Vestimenta"
        icon={Shirt}
        iconColor="#CFD6BA"
        overlayColor="#012D27"
      >
        <p className="text-lg leading-relaxed whitespace-pre-wrap text-[#CFD6BA]">
          {dresscode}
        </p>
      </InfoModal>

      {/* Tips Modal */}
      <InfoModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title="Información Adicional"
        icon={Lightbulb}
        iconColor="#CFD6BA"
        overlayColor="#012D27"
      >
        <p className="text-lg leading-relaxed whitespace-pre-wrap text-[#CFD6BA]">
          {tips}
        </p>
      </InfoModal>
    </>
  );
}