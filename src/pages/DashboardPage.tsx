import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Globe, UserPlus, Grid, Send, Music, Users, CheckCircle, XCircle, Clock, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Table {
  id: string;
  name: string;
  capacity: number;
}

interface Attendee {
  id: string;
  table_id: string | null;
  rsvp_status: 'confirmed' | 'declined' | 'pending';
  has_plus_one: boolean;
  plus_one_rsvp_status: 'confirmed' | 'declined' | 'pending';
}

interface DashboardStats {
  totalAttendees: number;
  confirmedAttendees: number;
  declinedAttendees: number;
  pendingAttendees: number;
  totalTables: number;
  totalSongs: number;
  tables: Table[];
  attendees: Attendee[];
  landingPage: {
    groom_name: string;
    bride_name: string;
    ceremony_date: string;
    ceremony_location: string;
    party_date: string;
    party_location: string;
  } | null;
  attendeesWithCompanion: number;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalAttendees: 0,
    confirmedAttendees: 0,
    declinedAttendees: 0,
    pendingAttendees: 0,
    totalTables: 0,
    totalSongs: 0,
    tables: [],
    attendees: [],
    landingPage: null,
    attendeesWithCompanion: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Fetch landing page data
        const { data: landingPage } = await supabase
          .from('landing_pages')
          .select('groom_name, bride_name, ceremony_date, ceremony_location, party_date, party_location')
          .eq('user_id', user.id)
          .single();

        // Fetch attendees stats
        const { data: attendeesData, error: attendeesError } = await supabase
          .from('attendees')
          .select('id, table_id, rsvp_status, has_plus_one, plus_one_rsvp_status')
          .eq('user_id', user.id);

        if (attendeesError) throw attendeesError;
        const attendees = attendeesData || [];

        const totalAttendees = attendees.length;
        const confirmedAttendees = attendees.filter(a => a.rsvp_status === 'confirmed').length;
        const declinedAttendees = attendees.filter(a => a.rsvp_status === 'declined').length;
        const pendingAttendees = attendees.filter(a => a.rsvp_status === 'pending').length;
        const attendeesWithCompanion = attendees.filter(a => a.has_plus_one && a.plus_one_rsvp_status === 'confirmed').length;

        // Fetch tables data
        const { data: tablesData, error: tablesError } = await supabase
          .from('tables')
          .select('id, name, capacity')
          .eq('user_id', user.id);
        
        if (tablesError) throw tablesError;
        const tables = tablesData || [];

        // Fetch songs count
        const { count: totalSongs } = await supabase
          .from('song_recommendations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setStats({
          totalAttendees,
          confirmedAttendees,
          declinedAttendees,
          pendingAttendees,
          totalTables: tables.length,
          totalSongs: totalSongs || 0,
          tables,
          attendees,
          landingPage,
          attendeesWithCompanion: attendeesWithCompanion || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const getTotalCapacity = () => {
    return stats.tables.reduce((sum, table) => sum + table.capacity, 0);
  };

  const getOccupiedSeats = (tableId: string) => {
    let count = 0;
    stats.attendees.forEach(attendee => {
      if (attendee.table_id === tableId && attendee.rsvp_status === 'confirmed') {
        count++;
        if (attendee.has_plus_one && attendee.plus_one_rsvp_status === 'confirmed') {
          count++;
        }
      }
    });
    return count;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {stats.landingPage && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Hola, {stats.landingPage.groom_name} y {stats.landingPage.bride_name}!
          </h1>
          <p className="text-gray-600">
            Tu boda será el {new Date(stats.landingPage.ceremony_date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Invitados</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalAttendees}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalAttendees ? Math.round((stats.confirmedAttendees / stats.totalAttendees) * 100) : 0}% confirmados
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Confirmados</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.confirmedAttendees}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalAttendees ? Math.round((stats.confirmedAttendees / stats.totalAttendees) * 100) : 0}% de invitados
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">No Asistirán</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.declinedAttendees}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalAttendees ? Math.round((stats.declinedAttendees / stats.totalAttendees) * 100) : 0}% de invitados
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pendientes</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingAttendees}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalAttendees ? Math.round((stats.pendingAttendees / stats.totalAttendees) * 100) : 0}% de invitados
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Resumen de Mesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.tables.length > 0 ? (
                stats.tables.map((table) => {
                  const occupied = getOccupiedSeats(table.id);
                  const percentage = table.capacity > 0 ? (occupied / table.capacity) * 100 : 0;
                  const progressBarColor = percentage === 100 ? 'bg-green-500' : percentage > 75 ? 'bg-orange-500' : 'bg-blue-500';

                  return (
                    <div key={table.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="text-gray-700 font-medium">{table.name}</p>
                        <p className="text-sm text-gray-500">{occupied}/{table.capacity} invitados</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${progressBarColor}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No hay mesas creadas aún.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Resumen de la Boda</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-6">Administración de invitaciones</h3>
            <p className="text-gray-500 mb-6 text-center">Gestiona tus invitados y mesas</p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Mesas</p>
                <h4 className="text-2xl font-bold text-gray-900">{stats.totalTables}</h4>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Capacidad Total</p>
                <h4 className="text-2xl font-bold text-gray-900">{getTotalCapacity()}</h4>
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center p-4 bg-gray-50 rounded-lg w-full max-w-xs">
              <p className="text-sm text-gray-500">Con Acompañante</p>
              <h4 className="text-2xl font-bold text-gray-900">{stats.attendeesWithCompanion}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-rose-500" />
              Invitación Digital
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Personaliza y comparte tu invitación digital con tus invitados
            </p>
            <Button
              onClick={() => navigate('/landing')}
              className="w-full"
            >
              Ver invitación
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-rose-500" />
              Invitados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p className="text-gray-500">
                Total de invitados: {stats.totalAttendees}
              </p>
              <p className="text-gray-500">
                Confirmados: {stats.confirmedAttendees}
              </p>
            </div>
            <Button
              onClick={() => navigate('/attendees')}
              className="w-full"
            >
              Ver invitados
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid className="h-5 w-5 text-rose-500" />
              Mesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Total de mesas: {stats.totalTables}
            </p>
            <Button
              onClick={() => navigate('/tables')}
              className="w-full"
            >
              Ver mesas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-rose-500" />
              Recordatorios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Envía recordatorios a tus invitados
            </p>
            <Button
              onClick={() => navigate('/reminders')}
              className="w-full"
            >
              Ver recordatorios
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-rose-500" />
              Música
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Sugerencias musicales: {stats.totalSongs}
            </p>
            <Button
              onClick={() => navigate('/songs')}
              className="w-full"
            >
              Ver música
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}