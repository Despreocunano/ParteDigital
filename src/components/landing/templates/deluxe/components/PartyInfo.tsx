import React, { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
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
    content 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    content: string; 
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C2127]/95 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl px-8 py-12 text-center text-[#D4B572]">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#D4B572]/30"></div>
          <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-[#D4B572]/30"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-[#D4B572]/30"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-[#D4B572]/30"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#D4B572]/10 hover:bg-[#D4B572]/20 transition-colors z-10"
          >
            <X className="w-5 h-5 text-[#D4B572]" />
          </button>

          <div className="space-y-8">
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
      <section className={`py-24 px-4 ${className}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-[#D4B572]">
            Información de la Fiesta
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1C2127] rounded-xl p-8 text-center border border-[#D4B572]/20">
              <div className="w-16 h-16 bg-[#D4B572]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shirt className="w-8 h-8 text-[#D4B572]" />
              </div>
              <h3 className="text-xl font-serif mb-4 text-[#D4B572]">Una orientación para tu vestuario</h3>
              <Button
                onClick={() => setShowDressCodeModal(true)}
                variant="secondary"
                className="w-full"
              >
                Ver más
              </Button>
            </div>
            
            {musicInfo && (
              <div className="bg-[#1C2127] rounded-xl p-8 text-center border border-[#D4B572]/20">
                <div className="w-16 h-16 bg-[#D4B572]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Music2 className="w-8 h-8 text-[#D4B572]" />
                </div>
                <h3 className="text-xl font-serif mb-4 text-[#D4B572]">¿Cuál es la canción que no debe faltar en la playlist de la fiesta?</h3>
                <Button
                  onClick={() => setShowMusicModal(true)}
                  variant="secondary"
                  className="w-full"
                >
                  Sugerir Canciones
                </Button>
              </div>
            )}
            
            <div className="bg-[#1C2127] rounded-xl p-8 text-center border border-[#D4B572]/20">
              <div className="w-16 h-16 bg-[#D4B572]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-[#D4B572]" />
              </div>
              <h3 className="text-xl font-serif mb-4 text-[#D4B572]">Información adicional para tener en cuenta</h3>
              <Button
                onClick={() => setShowTipsModal(true)}
                variant="secondary"
                className="w-full"
              >
                Ver más
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Music Modal */}
      {showMusicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C2127]/95 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl px-8 py-12 text-center text-[#D4B572]">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#D4B572]/30"></div>
            <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-[#D4B572]/30"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-[#D4B572]/30"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-[#D4B572]/30"></div>

            <button
              onClick={() => setShowMusicModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#D4B572]/10 hover:bg-[#D4B572]/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-[#D4B572]" />
            </button>

            <div className="space-y-8">
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

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>
      )}

      {/* Dress Code Modal */}
      <InfoModal
        isOpen={showDressCodeModal}
        onClose={() => setShowDressCodeModal(false)}
        title="Código de Vestimenta"
        content={dresscode}
      />

      {/* Tips Modal */}
      <InfoModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title="Información Adicional"
        content={tips}
      />
    </>
  );
}