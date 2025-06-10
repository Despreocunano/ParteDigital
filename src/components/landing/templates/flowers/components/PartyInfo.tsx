import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
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
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDF8F5]/95 backdrop-blur-sm"
      >
        <div 
          className="relative w-full max-w-2xl px-8 py-12 text-center text-[#8B4513]"
        >
          {/* Floral corner decorations */}
          <div className="absolute top-0 left-0 w-16 h-16">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
              <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
              <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 rotate-90">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
              <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
              <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-16 h-16 -rotate-90">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
              <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
              <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16 rotate-180">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
              <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
              <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
            </svg>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#E8A87C]/10 hover:bg-[#E8A87C]/20 transition-colors z-10"
          >
            <X className="w-5 h-5 text-[#8B4513]" />
          </button>

          <div className="space-y-8">
            <div className="w-16 h-16 bg-[#E8A87C]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon className="w-8 h-8 text-[#8B4513]" />
            </div>
            <h2 className="text-3xl font-serif">{title}</h2>
            <p className="text-[#8B4513]/80 text-lg leading-relaxed whitespace-pre-wrap">
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
            <h2 className="text-3xl md:text-4xl font-serif text-[#8B4513]">
              Información de la Fiesta
            </h2>
            <Divider className="mt-8" />
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
      {showMusicModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDF8F5]/95 backdrop-blur-sm"
        >
          <div 
            className="relative w-full max-w-2xl px-8 py-12 text-center text-[#8B4513]"
          >
            {/* Floral corner decorations */}
            <div className="absolute top-0 left-0 w-16 h-16">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
                <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
                <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 rotate-90">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
                <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
                <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-16 h-16 -rotate-90">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
                <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
                <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 rotate-180">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
                <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
                <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
              </svg>
            </div>

            <button
              onClick={() => setShowMusicModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#E8A87C]/10 hover:bg-[#E8A87C]/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-[#8B4513]" />
            </button>

            <div className="space-y-8">
              <div className="w-16 h-16 bg-[#E8A87C]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music2 className="w-8 h-8 text-[#8B4513]" />
              </div>
              <h2 className="text-3xl font-serif">Sugerir Canciones</h2>
              <p className="text-[#8B4513]/80">
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
                  className="bg-[#8B4513] hover:bg-[#A0522D] text-white"
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