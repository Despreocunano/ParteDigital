import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Music2, Calendar, Search, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';

interface SongRecommendation {
  id: string;
  song_name: string;
  artist_name: string;
  created_at: string;
}

export function SongRecommendationsPage() {
  const { user } = useAuth();
  const [songs, setSongs] = useState<SongRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSongs = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('song_recommendations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSongs(data || []);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [user]);

  const filteredSongs = songs.filter(song => 
    song.song_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    try {
      // Create CSV content
      const csvContent = [
        ['Canción', 'Artista', 'Fecha de Sugerencia'].join(','),
        ...filteredSongs.map(song => [
          `"${song.song_name}"`,
          `"${song.artist_name}"`,
          new Date(song.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        ].join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'canciones_sugeridas.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Lista de canciones exportada correctamente');
    } catch (error) {
      console.error('Error exporting songs:', error);
      toast.error('Error al exportar la lista de canciones');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Canciones Sugeridas</h1>
        <p className="text-gray-500 mt-1">
          Lista de canciones recomendadas por tus invitados
        </p>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Canciones</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Buscar canciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {filteredSongs.length > 0 && (
                <Button
                  variant="outline"
                  onClick={exportToExcel}
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Exportar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
            </div>
          ) : filteredSongs.length > 0 ? (
            <div className="divide-y">
              {filteredSongs.map((song) => (
                <div key={song.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Music2 className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{song.song_name}</h3>
                    <p className="text-gray-500 truncate">{song.artist_name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(song.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music2 className="w-6 h-6 text-rose-600" />
              </div>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'No se encontraron canciones que coincidan con tu búsqueda'
                  : 'Aún no hay canciones sugeridas por tus invitados'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}