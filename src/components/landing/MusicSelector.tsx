import { useState } from 'react';
import { Music, Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface Track {
  id: string;
  name: string;
  artist: string;
}

interface MusicSelectorProps {
  selectedTracks: Track[];
  onTracksChange: (tracks: Track[]) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

export function MusicSelector({ 
  selectedTracks, 
  onTracksChange,
  enabled,
  onEnabledChange
}: MusicSelectorProps) {
  const [songName, setSongName] = useState('');
  const [artistName, setArtistName] = useState('');

  const addTrack = () => {
    if (!songName.trim() || !artistName.trim()) return;
    
    if (selectedTracks.length >= 20) {
      return;
    }

    const newTrack: Track = {
      id: crypto.randomUUID(),
      name: songName.trim(),
      artist: artistName.trim()
    };

    onTracksChange([...selectedTracks, newTrack]);
    setSongName('');
    setArtistName('');
  };

  const removeTrack = (trackId: string) => {
    onTracksChange(selectedTracks.filter(t => t.id !== trackId));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Música</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Habilitar sugerencias</span>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onEnabledChange(e.target.checked)}
              className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {enabled ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Nombre de la canción"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
              />
              <Input
                placeholder="Artista"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
              />
            </div>
            <Button
              onClick={addTrack}
              disabled={!songName.trim() || !artistName.trim() || selectedTracks.length >= 20}
              className="w-full"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Agregar Canción
            </Button>

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">
                Canciones Sugeridas ({selectedTracks.length}/20)
              </h4>
              {selectedTracks.length > 0 ? (
                <div className="border rounded-md divide-y">
                  {selectedTracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center justify-between p-3"
                    >
                      <div>
                        <p className="font-medium">{track.name}</p>
                        <p className="text-sm text-gray-500">{track.artist}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTrack(track.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-md">
                  <Music className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No hay canciones sugeridas</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Music className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">
              Habilita las sugerencias de música para permitir que tus invitados sugieran canciones
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}