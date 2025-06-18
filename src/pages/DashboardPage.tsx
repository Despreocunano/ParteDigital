import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Globe, UserPlus, Grid, Send, Music, ListChecks, CheckCircle2, XCircle, Clock, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [totalInvitados, setTotalInvitados] = useState(0);
  const [invitadosConAcompanante, setInvitadosConAcompanante] = useState(0);
  const [confirmados, setConfirmados] = useState(0);
  const [noAsistiran, setNoAsistiran] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [mesasData, setMesasData] = useState<{ name: string; current: number; total: number }[]>([]);
  const [totalMesas, setTotalMesas] = useState(0);
  const [capacidadTotal, setCapacidadTotal] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      // Fetch Attendees Data
      const { data: attendees, error: attendeesError } = await supabase
        .from('attendees')
        .select('rsvp_status, has_plus_one, plus_one_rsvp_status')
        .eq('user_id', user.id);

      if (attendeesError) {
        console.error('Error fetching attendees:', attendeesError);
        return;
      }

      let primaryGuestsCount = 0; // Cuenta solo los invitados principales
      let confirmedCount = 0;
      let declinedCount = 0;
      let pendingCount = 0;
      let plusOneCount = 0; // Cuenta solo los acompañantes

      if (attendees) {
        attendees.forEach(attendee => {
          primaryGuestsCount++; // Cada asistente principal

          if (attendee.rsvp_status === 'confirmed') {
            confirmedCount++;
          } else if (attendee.rsvp_status === 'declined') {
            declinedCount++;
          } else {
            pendingCount++;
          }

          if (attendee.has_plus_one) {
            plusOneCount++; // Cada acompañante
            if (attendee.plus_one_rsvp_status === 'confirmed') {
              confirmedCount++;
            } else if (attendee.plus_one_rsvp_status === 'declined') {
              declinedCount++;
            } else if (attendee.plus_one_rsvp_status === 'pending') {
              pendingCount++;
            }
          }
        });
      }

      setTotalInvitados(primaryGuestsCount + plusOneCount);
      setInvitadosConAcompanante(plusOneCount);
      setConfirmados(confirmedCount);
      setNoAsistiran(declinedCount);
      setPendientes(pendingCount);

      // Fetch Tables Data
      const { data: tables, error: tablesError } = await supabase
        .from('guest_tables')
        .select('id, name, capacity')
        .eq('user_id', user.id);

      if (tablesError) {
        console.error('Error fetching tables:', tablesError);
        return;
      }

      let totalTablesCount = 0;
      let totalCapacityCount = 0;
      const fetchedMesasData: { name: string; current: number; total: number }[] = [];

      if (tables) {
        totalTablesCount = tables.length;
        for (const table of tables) {
          const { count, error: countError } = await supabase
            .from('attendees')
            .select('id', { count: 'exact', head: true })
            .eq('table_id', table.id);

          if (countError) {
            console.error(`Error fetching attendees for table ${table.name}:`, countError);
            continue;
          }
          fetchedMesasData.push({
            name: table.name,
            current: count || 0,
            total: table.capacity || 0,
          });
          totalCapacityCount += table.capacity || 0;
        }
      }
      setMesasData(fetchedMesasData);
      setTotalMesas(totalTablesCount);
      setCapacidadTotal(totalCapacityCount);
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel Principal</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Invitados</CardTitle>
            <UserPlus className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvitados}</div>
            <p className="text-xs text-gray-500">
              {/* Eliminado: {invitadosConAcompanante} con acompañante */}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmados}</div>
            <p className="text-xs text-gray-500 mb-2">
              {totalInvitados > 0 ? Math.round((confirmados / totalInvitados) * 100) : 0}% de invitados
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${totalInvitados > 0 ? (confirmados / totalInvitados) * 100 : 0}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Asistirán</CardTitle>
            <XCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{noAsistiran}</div>
            <p className="text-xs text-gray-500 mb-2">
              {totalInvitados > 0 ? Math.round((noAsistiran / totalInvitados) * 100) : 0}% de invitados
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className="bg-rose-600 h-1.5 rounded-full" style={{ width: `${totalInvitados > 0 ? (noAsistiran / totalInvitados) * 100 : 0}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendientes}</div>
            <p className="text-xs text-gray-500 mb-2">
              {totalInvitados > 0 ? Math.round((pendientes / totalInvitados) * 100) : 0}% de invitados
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${totalInvitados > 0 ? (pendientes / totalInvitados) * 100 : 0}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumen de Mesas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Resumen de Mesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mesasData.map((mesa, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{mesa.name}</span>
                    <span className="text-xs text-gray-500">{mesa.current}/{mesa.total} invitados</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${mesa.total > 0 ? (mesa.current / mesa.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumen de la Boda */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Resumen de la Boda</CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <Heart className="h-16 w-16 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Administración de invitaciones
            </h2>
            <p className="text-gray-500 mb-6">
              Gestiona tus invitados y mesas
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Mesas</p>
                <p className="text-2xl font-bold text-gray-900">{totalMesas}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Capacidad Total</p>
                <p className="text-2xl font-bold text-gray-900">{capacidadTotal}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/landing')}
              className="bg-primary hover:bg-primary-dark text-primary-contrast w-full"
            >
              Administrar invitación
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}