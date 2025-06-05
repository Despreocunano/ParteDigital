import React, { useState } from 'react';
import { Music2, Shirt, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../../ui/Button';
import { Modal } from '../../../../ui/Modal';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface Track {
  id: string;
  name: string;
  artist: string;
  albumCover?: string;
}

interface PartyInfoProps {
  dresscode?: string;
  musicInfo?: string;
  tips?: string;
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
    if (!userId) {
      toast.error('Error al guardar las canciones');
      return;
    }

    if (selectedTracks.length === 0) {
      toast.error('Por favor selecciona al menos una canción');
      return;
    }

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

      toast.success('Gracias por recomendarnos una canción');
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
      <section className={`py-24 px-4 ${className}`}>
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-serif text-center mb-12 text-[#D4B572]"
            variants={item}
          >
            Información de la Fiesta
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {dresscode && (
              <motion.div 
                className="bg-[#1C2127] rounded-xl p-8 text-center border border-[#D4B572]/20"
                variants={item}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-[#D4B572]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shirt className="w-8 h-8 text-[#D4B572]" />
                </div>
                <h3 className="text-xl font-serif mb-4 text-[#D4B572]">Código de Vestimenta</h3>
                <p className="text-[#D4B572]/80">{dresscode}</p>
              </motion.div>
            )}
            
            {musicInfo && (
              <motion.div 
                className="bg-[#1C2127] rounded-xl p-8 text-center border border-[#D4B572]/20"
                variants={item}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-[#D4B572]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Music2 className="w-8 h-8 text-[#D4B572]" />
                </div>
                <h3 className="text-xl font-serif mb-4 text-[#D4B572]">Música</h3>
                <p className="text-[#D4B572]/80 mb-4">{musicInfo}</p>
                <Button
                  onClick={() => setShowMusicModal(true)}
                  variant="outline"
                  className="border-[#D4B572]/20 text-[#D4B572] hover:bg-[#D4B572]/10"
                >
                  Sugerir Canciones
                </Button>
              </motion.div>
            )}
            
            {tips && (
              <motion.div 
                className="bg-[#1C2127] rounded-xl p-8 text-center border border-[#D4B572]/20"
                variants={item}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-[#D4B572]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-8 h-8 text-[#D4B572]" />
                </div>
                <h3 className="text-xl font-serif mb-4 text-[#D4B572]">Tips y Notas</h3>
                <p className="text-[#D4B572]/80">{tips}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      <Modal
        isOpen={showMusicModal}
        onClose={() => setShowMusicModal(false)}
        title="Sugerir Canciones"
        onConfirm={handleSubmit}
        confirmText="Guardar Canciones"
        isLoading={isSubmitting}
      >
        <div className="space-y-6">
          <SpotifySearch
            selectedTracks={selectedTracks}
            onSelect={(track) => setSelectedTracks([...selectedTracks, track])}
            onRemove={(trackId) => setSelectedTracks(selectedTracks.filter(t => t.id !== trackId))}
            maxTracks={2}
          />

          <p className="text-sm text-gray-500 text-center">
            Puedes sugerir hasta 2 canciones para la fiesta
          </p>
        </div>
      </Modal>
    </>
  );
}