import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Music } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import SpotifyWebApi from 'spotify-web-api-js';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';

interface Track {
  id: string;
  name: string;
  artist: string;
  albumCover?: string;
}

interface SpotifySearchProps {
  userId?: string;
  maxTracks?: number;
}

const spotify = new SpotifyWebApi();

export function SpotifySearch({ 
  userId,
  maxTracks = 2
}: SpotifySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(import.meta.env.VITE_SPOTIFY_CLIENT_ID + ':' + import.meta.env.VITE_SPOTIFY_CLIENT_SECRET)
          },
          body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        setToken(data.access_token);
        spotify.setAccessToken(data.access_token);
      } catch (error) {
        console.error('Error getting Spotify token:', error);
        toast.error('Error al conectar con Spotify');
      }
    };

    getToken();
  }, []);

  const searchTracks = async () => {
    if (!searchTerm.trim() || !token) return;

    setIsSearching(true);
    try {
      const response = await spotify.searchTracks(searchTerm);
      const tracks = response.tracks?.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        albumCover: track.album.images[2]?.url
      })) || [];
      setResults(tracks);
    } catch (error) {
      console.error('Error searching tracks:', error);
      toast.error('Error al buscar canciones');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (track: Track) => {
    if (selectedTracks.length >= maxTracks) {
      toast.error(`Solo puedes seleccionar hasta ${maxTracks} canciones`);
      return;
    }
    setSelectedTracks([...selectedTracks, track]);
    setSearchTerm('');
    setResults([]);
  };

  const handleRemove = (trackId: string) => {
    setSelectedTracks(selectedTracks.filter(t => t.id !== trackId));
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
      setSelectedTracks([]);
    } catch (error) {
      console.error('Error saving songs:', error);
      toast.error('Error al guardar las canciones');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      {selectedTracks.length < maxTracks && (
        <div>
          <div className="relative mb-4">
            <Input
              placeholder="Buscar canciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchTracks()}
              className="pl-10 bg-white border-[#333]/20 text-[#333] placeholder-[#333]/60 font-sans focus:outline-none focus:ring-0 focus:border-[#333]/20"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#333]/60" />
            {searchTerm && (
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#333] hover:bg-[#666] text-white font-sans"
                size="sm"
                onClick={searchTracks}
                isLoading={isSearching}
              >
                Buscar
              </Button>
            )}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="max-h-64 overflow-y-auto border border-[#333]/20 rounded-lg divide-y divide-[#333]/20">
              {results.map((track) => (
                <button
                  key={track.id}
                  className="w-full flex items-center gap-4 p-4 hover:bg-[#333]/10 transition-colors"
                  onClick={() => handleSelect(track)}
                >
                  {track.albumCover ? (
                    <img 
                      src={track.albumCover} 
                      alt={track.name} 
                      className="w-12 h-12 rounded-md"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#333]/10 rounded-md flex items-center justify-center">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-[#333] truncate font-sans">{track.name}</p>
                    <p className="text-sm text-[#333]/80 truncate font-sans">{track.artist}</p>
                  </div>
                  <Plus className="h-4 w-4 text-[#333]/60 font-sans" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Tracks */}
      {selectedTracks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-lora text-[#333]">Canciones seleccionadas:</h3>
          {selectedTracks.map((track) => (
            <div 
              key={track.id} 
              className="flex items-center gap-4 p-4 rounded-lg bg-[#1C2127] border border-[#333]/20"
            >
              {track.albumCover ? (
                <img 
                  src={track.albumCover} 
                  alt={track.name} 
                  className="w-12 h-12 rounded-md"
                />
              ) : (
                <div className="w-12 h-12 bg-[#D4B572]/10 rounded-md flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate font-sans">{track.name}</p>
                <p className="text-sm text-white/80 truncate font-sans">{track.artist}</p>
              </div>
              <Button
                size="sm"
                onClick={() => handleRemove(track.id)}
                className="text-white/60 hover:text-white bg-[#333] hover:bg-[#666]"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      {selectedTracks.length > 0 && (
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#333] text-white font-sans hover:bg-[#666] hover:text-white rounded-full border hover:border-[#CFD6BA]"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Sugerencias'}
        </Button>
      )}
    </div>
  );
}