import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Music } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import SpotifyWebApi from 'spotify-web-api-js';
import { toast } from 'react-hot-toast';

interface Track {
  id: string;
  name: string;
  artist: string;
  albumCover?: string;
}

interface SpotifySearchProps {
  onSelect: (track: Track) => void;
  onRemove: (trackId: string) => void;
  selectedTracks: Track[];
  maxTracks?: number;
}

const spotify = new SpotifyWebApi();

export function SpotifySearch({ 
  onSelect, 
  onRemove, 
  selectedTracks, 
  maxTracks = 2
}: SpotifySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [token, setToken] = useState<string | null>(null);

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
    onSelect(track);
    setSearchTerm('');
    setResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Selected Tracks */}
      <div className="space-y-4">
        {selectedTracks.map((track) => (
          <div 
            key={track.id} 
            className="flex items-center gap-4 p-4 rounded-lg bg-[#1C2127] border border-[#D4B572]/20"
          >
            {track.albumCover ? (
              <img 
                src={track.albumCover} 
                alt={track.name} 
                className="w-12 h-12 rounded-md"
              />
            ) : (
              <div className="w-12 h-12 bg-[#D4B572]/10 rounded-md flex items-center justify-center">
                <Music className="w-6 h-6 text-[#D4B572]" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#D4B572] truncate">{track.name}</p>
              <p className="text-sm text-[#D4B572]/80 truncate">{track.artist}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRemove(track.id)}
              className="text-[#D4B572]/60 hover:text-[#D4B572]"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Search Section */}
      {selectedTracks.length < maxTracks && (
        <div>
          <div className="relative mb-4">
            <Input
              placeholder="Buscar canciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchTracks()}
              className="pl-10 bg-[#1C2127] border-[#D4B572]/20 text-[#D4B572] placeholder-[#D4B572]/60"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4B572]/60" />
            {searchTerm && (
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2"
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
            <div className="max-h-64 overflow-y-auto border border-[#D4B572]/20 rounded-lg divide-y divide-[#D4B572]/20">
              {results.map((track) => (
                <button
                  key={track.id}
                  className="w-full flex items-center gap-4 p-4 hover:bg-[#D4B572]/10 transition-colors"
                  onClick={() => handleSelect(track)}
                >
                  {track.albumCover ? (
                    <img 
                      src={track.albumCover} 
                      alt={track.name} 
                      className="w-12 h-12 rounded-md"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#D4B572]/10 rounded-md flex items-center justify-center">
                      <Music className="w-6 h-6 text-[#D4B572]" />
                    </div>
                  )}
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-[#D4B572] truncate">{track.name}</p>
                    <p className="text-sm text-[#D4B572]/80 truncate">{track.artist}</p>
                  </div>
                  <Plus className="h-4 w-4 text-[#D4B572]/60" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}