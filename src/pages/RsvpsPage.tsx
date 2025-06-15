import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAttendees } from '../hooks/useAttendees';
import { useTables } from '../hooks/useTables';
import { X, Clock, Send, CheckCircle, XCircle, Table2, Search, Download, Filter } from 'lucide-react';
import { Attendee } from '../types/supabase';
import { sendEmail } from '../lib/api';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useWedding } from '../hooks/useWedding';
import { useAuth } from '../context/AuthContext';
import { getReminderTemplate, getSignatureTemplate } from '../templates/emailTemplates';

export function RsvpsPage() {
  const { attendees, loading: attendeesLoading } = useAttendees();
  const { tables, loading: tablesLoading } = useTables();
  const { user } = useAuth();
  const { groomName, brideName, profileImage } = useWedding();
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all');
  
  const filteredAttendees = attendees.filter((attendee) => {
    const fullName = `${attendee.first_name} ${attendee.last_name}`.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = fullName.includes(searchTermLower) || 
           attendee.email.toLowerCase().includes(searchTermLower) ||
           (attendee.plus_one_name && attendee.plus_one_name.toLowerCase().includes(searchTermLower));
    
    const matchesStatus = statusFilter === 'all' || attendee.rsvp_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calcular estadísticas incluyendo acompañantes
  const totalStats = {
    total: attendees.reduce((acc, attendee) => {
      return acc + 1 + (attendee.has_plus_one ? 1 : 0);
    }, 0),
    confirmed: attendees.reduce((acc, attendee) => {
      const mainConfirmed = attendee.rsvp_status === 'confirmed' ? 1 : 0;
      const plusOneConfirmed = attendee.has_plus_one && attendee.plus_one_rsvp_status === 'confirmed' ? 1 : 0;
      return acc + mainConfirmed + plusOneConfirmed;
    }, 0),
    declined: attendees.reduce((acc, attendee) => {
      const mainDeclined = attendee.rsvp_status === 'declined' ? 1 : 0;
      const plusOneDeclined = attendee.has_plus_one && attendee.plus_one_rsvp_status === 'declined' ? 1 : 0;
      return acc + mainDeclined + plusOneDeclined;
    }, 0),
    pending: attendees.reduce((acc, attendee) => {
      const mainPending = attendee.rsvp_status === 'pending' ? 1 : 0;
      const plusOnePending = attendee.has_plus_one && (!attendee.plus_one_rsvp_status || attendee.plus_one_rsvp_status === 'pending') ? 1 : 0;
      return acc + mainPending + plusOnePending;
    }, 0),
  };

  // Calcular estadísticas de invitados filtrados
  const stats = {
    total: filteredAttendees.reduce((acc, attendee) => {
      return acc + 1 + (attendee.has_plus_one ? 1 : 0);
    }, 0),
    confirmed: filteredAttendees.reduce((acc, attendee) => {
      const mainConfirmed = attendee.rsvp_status === 'confirmed' ? 1 : 0;
      const plusOneConfirmed = attendee.has_plus_one && attendee.plus_one_rsvp_status === 'confirmed' ? 1 : 0;
      return acc + mainConfirmed + plusOneConfirmed;
    }, 0),
    declined: filteredAttendees.reduce((acc, attendee) => {
      const mainDeclined = attendee.rsvp_status === 'declined' ? 1 : 0;
      const plusOneDeclined = attendee.has_plus_one && attendee.plus_one_rsvp_status === 'declined' ? 1 : 0;
      return acc + mainDeclined + plusOneDeclined;
    }, 0),
    pending: filteredAttendees.reduce((acc, attendee) => {
      const mainPending = attendee.rsvp_status === 'pending' ? 1 : 0;
      const plusOnePending = attendee.has_plus_one && (!attendee.plus_one_rsvp_status || attendee.plus_one_rsvp_status === 'pending') ? 1 : 0;
      return acc + mainPending + plusOnePending;
    }, 0),
  };

  const handleSendSingleReminder = async (attendee: Attendee) => {
    try {
      setSendingReminder(attendee.id);
      
      const { data: landingPage, error: landingError } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (landingError) throw new Error('Error fetching landing page');

      const landingUrl = landingPage?.slug 
        ? `https://tuparte.digital/invitacion/${landingPage.slug}`
        : '';

      const signature = getSignatureTemplate(groomName, brideName, profileImage);
      const message = getReminderTemplate({ attendee, landingUrl, signature });

      await sendEmail(
        attendee.id,
        'Recordatorio de invitación',
        message
      );

      toast.success('Recordatorio enviado correctamente');
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Error al enviar el recordatorio');
    } finally {
      setSendingReminder(null);
    }
  };

  const exportToExcel = () => {
    try {
      const csvContent = [
        ['Nombre', 'Email', 'Teléfono', 'Estado', 'Restricciones Alimentarias', 'Mesa', 'Acompañante', 'Estado Acompañante', 'Restricciones Acompañante'].join(','),
        ...filteredAttendees.map(attendee => {
          const currentTable = tables.find(t => t.id === attendee.table_id);
          return [
            `"${attendee.first_name} ${attendee.last_name}"`,
            `"${attendee.email}"`,
            `"${attendee.phone || ''}"`,
            `"${attendee.rsvp_status}"`,
            `"${attendee.dietary_restrictions || ''}"`,
            `"${currentTable?.name || 'Sin mesa'}"`,
            `"${attendee.plus_one_name || ''}"`,
            `"${attendee.plus_one_rsvp_status || ''}"`,
            `"${attendee.plus_one_dietary_restrictions || ''}"`,
          ].join(',');
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'confirmaciones.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Lista de confirmaciones exportada correctamente');
    } catch (error) {
      console.error('Error exporting confirmations:', error);
      toast.error('Error al exportar la lista de confirmaciones');
    }
  };

  if (attendeesLoading || tablesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Confirmaciones</h1>
          <p className="text-gray-500 mt-1">
            {totalStats.total} invitados en total
          </p>
        </div>
        <Button
          onClick={exportToExcel}
          leftIcon={<Download className="h-4 w-4" />}
          className="bg-primary text-primary-contrast hover:bg-primary-dark"
        >
          Exportar Lista
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Confirmados</p>
                <h3 className="text-3xl font-bold text-green-600 mt-1">{totalStats.confirmed}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {totalStats.total ? Math.round((totalStats.confirmed / totalStats.total) * 100) : 0}% de invitados
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">No Asistirán</p>
                <h3 className="text-3xl font-bold text-red-600 mt-1">{totalStats.declined}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {totalStats.total ? Math.round((totalStats.declined / totalStats.total) * 100) : 0}% de invitados
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <h3 className="text-3xl font-bold text-amber-600 mt-1">{totalStats.pending}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {totalStats.total ? Math.round((totalStats.pending / totalStats.total) * 100) : 0}% de invitados
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Buscar invitado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4 text-gray-400" />}
                rightIcon={searchTerm ? (
                  <button onClick={() => setSearchTerm('')}>
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                ) : undefined}
                className="w-full sm:w-80"
              />
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent sm:text-sm"
                >
                  <option value="all">Todos</option>
                  <option value="pending">Pendientes</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="declined">No asistirán</option>
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Invitado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Mesa</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Restricciones</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAttendees.map((attendee) => {
                  const currentTable = tables.find(t => t.id === attendee.table_id);
                  return (
                    <tr key={attendee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {attendee.first_name} {attendee.last_name}
                          </div>
                          {attendee.has_plus_one && attendee.plus_one_name && (
                            <div className="text-sm text-gray-600 mt-1">
                              + {attendee.plus_one_name}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center justify-center w-24">
                          {attendee.rsvp_status === 'confirmed' && (
                            <span className="w-full px-4 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Confirmado</span>
                          )}
                          {attendee.rsvp_status === 'declined' && (
                            <span className="w-full px-4 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">No asistirá</span>
                          )}
                          {attendee.rsvp_status === 'pending' && (
                            <span className="w-full px-4 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pendiente</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Table2 className="h-4 w-4 mr-2" />
                          {currentTable ? currentTable.name : 'Sin mesa asignada'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">
                          {attendee.dietary_restrictions ? (
                            <div>{attendee.dietary_restrictions}</div>
                          ) : (
                            <div className="text-gray-400">Ninguna</div>
                          )}
                          {attendee.has_plus_one && attendee.plus_one_dietary_restrictions && (
                            <div className="text-xs text-gray-500 mt-1">
                              Acompañante: {attendee.plus_one_dietary_restrictions}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {attendee.rsvp_status === 'pending' && (
                          <Button
                            size="sm"
                            leftIcon={<Send className="h-3 w-3" />}
                            onClick={() => handleSendSingleReminder(attendee)}
                            isLoading={sendingReminder === attendee.id}
                            className="bg-primary text-primary-contrast hover:bg-primary-dark"
                          >
                            Recordar
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}