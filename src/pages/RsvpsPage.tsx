import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAttendees } from '../hooks/useAttendees';
import { useTables } from '../hooks/useTables';
import { X, Clock, Send, CheckCircle, XCircle, Table2, Search, Download } from 'lucide-react';
import { Attendee } from '../types/supabase';
import { AttendeeStatus } from '../components/attendees/AttendeeStatus';
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
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [bulkReminderMode, setBulkReminderMode] = useState(false);
  const [reminderSubject, setReminderSubject] = useState('Confirma tu asistencia');
  const [reminderMessage, setReminderMessage] = useState('');
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAttendees = attendees.filter((attendee) => {
    const fullName = `${attendee.first_name} ${attendee.last_name}`.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    return fullName.includes(searchTermLower) || 
           attendee.email.toLowerCase().includes(searchTermLower) ||
           (attendee.plus_one_name && attendee.plus_one_name.toLowerCase().includes(searchTermLower));
  });
  
  const stats = {
    total: attendees.length,
    confirmed: attendees.filter(a => a.rsvp_status === 'confirmed').length,
    declined: attendees.filter(a => a.rsvp_status === 'declined').length,
    pending: attendees.filter(a => a.rsvp_status === 'pending').length,
  };

  const pendingAttendees = filteredAttendees.filter(attendee => attendee.rsvp_status === 'pending');
  const confirmedAttendees = filteredAttendees.filter(attendee => attendee.rsvp_status === 'confirmed');
  const declinedAttendees = filteredAttendees.filter(attendee => attendee.rsvp_status === 'declined');

  const toggleAttendeeSelection = (attendeeId: string) => {
    if (selectedAttendees.includes(attendeeId)) {
      setSelectedAttendees(selectedAttendees.filter(id => id !== attendeeId));
    } else {
      setSelectedAttendees([...selectedAttendees, attendeeId]);
    }
  };

  const selectAllPending = () => {
    setSelectedAttendees(pendingAttendees.map(attendee => attendee.id));
  };

  const clearSelection = () => {
    setSelectedAttendees([]);
  };

  const handleSendBulkReminders = async () => {
    if (selectedAttendees.length === 0 || !reminderMessage.trim()) return;
    
    setSendingReminder(null);
    
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const attendeeId of selectedAttendees) {
        try {
          await sendEmail(
            attendeeId,
            reminderSubject,
            reminderMessage
          );
          successCount++;
        } catch (error) {
          console.error('Error sending reminder:', error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Recordatorios enviados a ${successCount} invitados`);
      }
      
      if (errorCount > 0) {
        toast.error(`Error al enviar ${errorCount} recordatorios`);
      }

      setBulkReminderMode(false);
      setSelectedAttendees([]);
      setReminderMessage('');
    } catch (error) {
      console.error('Error sending reminders:', error);
      toast.error('Error al enviar los recordatorios');
    } finally {
      setSendingReminder(null);
    }
  };

  const handleSendSingleReminder = async (attendee: Attendee) => {
    try {
      setSendingReminder(attendee.id);
      
      // Get landing page data
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
      // Create CSV content
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

      // Create blob and download
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

  const renderAttendeeRow = (attendee: Attendee) => {
    const isSelected = selectedAttendees.includes(attendee.id);
    const currentTable = tables.find(t => t.id === attendee.table_id);
    
    return (
      <tr key={attendee.id} className="border-b border-gray-200 hover:bg-gray-50">
        {bulkReminderMode && (
          <td className="px-4 py-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleAttendeeSelection(attendee.id)}
              className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
            />
          </td>
        )}
        <td className="px-4 py-3">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-900">
              {attendee.first_name} {attendee.last_name}
            </div>
            {attendee.has_plus_one && attendee.plus_one_name && (
              <div className="text-sm text-gray-500 mt-1">
                + {attendee.plus_one_name}
              </div>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="text-sm text-gray-500">{attendee.email}</div>
        </td>
        <td className="px-4 py-3">
          <AttendeeStatus status={attendee.rsvp_status} />
        </td>
        <td className="px-4 py-3">
          <div className="text-sm text-gray-600">
            {attendee.dietary_restrictions && (
              <div className="mb-1">{attendee.dietary_restrictions}</div>
            )}
            {attendee.has_plus_one && attendee.plus_one_dietary_restrictions && (
              <div className="text-xs text-gray-500">
                Acompañante: {attendee.plus_one_dietary_restrictions}
              </div>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Table2 className="h-4 w-4 mr-2" />
            {currentTable ? currentTable.name : 'Sin mesa asignada'}
          </div>
        </td>
        {!bulkReminderMode && attendee.rsvp_status === 'pending' && (
          <td className="px-4 py-3 text-right">
            <Button
              size="sm"
              leftIcon={<Send className="h-3 w-3" />}
              onClick={() => handleSendSingleReminder(attendee)}
              isLoading={sendingReminder === attendee.id}
            >
              Recordar
            </Button>
          </td>
        )}
      </tr>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Confirmaciones</h1>
        <p className="text-gray-500 mt-1">
          Gestiona las confirmaciones de asistencia de tus invitados
        </p>
      </div>
      
      {!attendeesLoading && !tablesLoading && !bulkReminderMode && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Confirmados</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.confirmed}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total ? Math.round((stats.confirmed / stats.total) * 100) : 0}% de invitados
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
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.declined}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total ? Math.round((stats.declined / stats.total) * 100) : 0}% de invitados
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
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total ? Math.round((stats.pending / stats.total) * 100) : 0}% de invitados
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {bulkReminderMode ? (
        <Card>
          <CardHeader>
            <CardTitle>Enviar Recordatorios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Invitados</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAttendees.length > 0 ? (
                    selectedAttendees.map(id => {
                      const attendee = attendees.find(a => a.id === id);
                      return attendee ? (
                        <div
                          key={id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {attendee.first_name} {attendee.last_name}
                          <button
                            type="button"
                            className="ml-1 text-gray-400 hover:text-gray-600"
                            onClick={() => toggleAttendeeSelection(id)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <p className="text-sm text-gray-500">No hay invitados seleccionados</p>
                  )}
                </div>
                {pendingAttendees.length > 0 && (
                  <div className="mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={selectAllPending}
                    >
                      Seleccionar Todos ({pendingAttendees.length})
                    </Button>
                  </div>
                )}
              </div>
              
              <Input
                label="Asunto"
                value={reminderSubject}
                onChange={(e) => setReminderSubject(e.target.value)}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  rows={5}
                  className="w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent p-3"
                  placeholder="Escribe tu mensaje..."
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setBulkReminderMode(false);
                    setSelectedAttendees([]);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSendBulkReminders}
                  isLoading={sendingReminder !== null}
                  disabled={selectedAttendees.length === 0 || !reminderMessage.trim()}
                  leftIcon={<Send className="h-4 w-4" />}
                >
                  Enviar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Respuestas</CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar invitados..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {filteredAttendees.length > 0 && (
                    <Button
                      variant="secondary"
                      onClick={exportToExcel}
                      leftIcon={<Download className="h-4 w-4" />}
                    >
                      Exportar
                    </Button>
                  )}
                  {pendingAttendees.length > 0 && (
                    <Button
                      onClick={() => {
                        selectAllPending();
                        setBulkReminderMode(true);
                      }}
                      leftIcon={<Send className="h-4 w-4" />}
                    >
                      Enviar Recordatorios
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0 py-0">
            {attendeesLoading || tablesLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
              </div>
            ) : filteredAttendees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {bulkReminderMode && (
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedAttendees.length === pendingAttendees.length && pendingAttendees.length > 0}
                            onChange={() => {
                              if (selectedAttendees.length === pendingAttendees.length) {
                                clearSelection();
                              } else {
                                selectAllPending();
                              }
                            }}
                            className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                          />
                        </th>
                      )}
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restricciones Alimentarias
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mesa
                      </th>
                      {!bulkReminderMode && (
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingAttendees.map((attendee) => 
                      renderAttendeeRow(attendee)
                    )}
                    {confirmedAttendees.map((attendee) => 
                      renderAttendeeRow(attendee)
                    )}
                    {declinedAttendees.map((attendee) => 
                      renderAttendeeRow(attendee)
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {searchTerm ? 'No se encontraron invitados' : 'No hay invitados aún'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}