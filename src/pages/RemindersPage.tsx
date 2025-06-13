import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useAttendees } from '../hooks/useAttendees';
import { useTables } from '../hooks/useTables';
import { useWedding } from '../hooks/useWedding';
import { sendEmail } from '../lib/api';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Search, Send, Check, X, Clock, Table2, Tag, Heart } from 'lucide-react';

interface LandingPageData {
  ceremony_time?: string;
  party_time?: string;
  ceremony_location?: string;
  party_location?: string;
  ceremony_address?: string;
  party_address?: string;
}

export function RemindersPage() {
  const { attendees, loading: attendeesLoading } = useAttendees();
  const { tables } = useTables();
  const { groomName, brideName, profileImage } = useWedding();
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all');
  const [isSending, setIsSending] = useState(false);
  const [activeInput, setActiveInput] = useState<'subject' | 'message'>('subject');
  const [landingPage, setLandingPage] = useState<LandingPageData | null>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data, error } = await supabase
          .from('landing_pages')
          .select(`
            ceremony_time,
            party_time,
            ceremony_location,
            party_location,
            ceremony_address,
            party_address
          `)
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        setLandingPage(data);

        // Check for missing fields and warn user
        const missingFields = [];
        if (!data?.ceremony_time) missingFields.push('hora de la ceremonia');
        if (!data?.party_time) missingFields.push('hora de la fiesta');
        if (!data?.ceremony_location) missingFields.push('lugar de la ceremonia');
        if (!data?.party_location) missingFields.push('lugar de la fiesta');
        if (!data?.ceremony_address) missingFields.push('dirección de la ceremonia');
        if (!data?.party_address) missingFields.push('dirección de la fiesta');

        if (missingFields.length > 0) {
          toast(`Algunos datos de la invitación no están definidos: ${missingFields.join(', ')}. Los recordatorios mostrarán valores por defecto para estos campos.`, {
            icon: '⚠️',
            style: {
              background: '#FEF3C7',
              color: '#92400E',
            },
          });
        }
      } catch (error) {
        console.error('Error fetching landing page:', error);
        toast.error('Error al cargar los datos de la invitación');
      }
    };

    fetchLandingPage();
  }, []);

  const variables = [
    { name: '{nombre}', description: 'Nombre del invitado' },
    { name: '{apellido}', description: 'Apellido del invitado' },
    { name: '{mesa}', description: 'Mesa asignada' },
    { name: '{fecha}', description: 'Fecha actual' },
    { name: '{hora_ceremonia}', description: 'Hora de la ceremonia' },
    { name: '{hora_fiesta}', description: 'Hora de la fiesta' },
    { name: '{lugar_ceremonia}', description: 'Lugar de la ceremonia' },
    { name: '{lugar_fiesta}', description: 'Lugar de la fiesta' },
    { name: '{direccion_ceremonia}', description: 'Dirección de la ceremonia' },
    { name: '{direccion_fiesta}', description: 'Dirección de la fiesta' }
  ];

  const signature = `
<br><br>
<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
  <table cellpadding="0" cellspacing="0" style="border: none;">
    <tr>
      <td style="vertical-align: middle; padding-right: 15px;">
        <img src="${profileImage || 'https://images.pexels.com/photos/931158/pexels-photo-931158.jpeg?w=50&h=50'}" alt="Logo" style="width: 50px; height: 50px; border-radius: 50%;">
      </td>
      <td style="vertical-align: middle;">
        <div style="font-family: 'Playfair Display', serif; color: #B76E79; font-size: 18px;">
          ${groomName} & ${brideName}
        </div>
        <div style="font-family: Arial, sans-serif; color: #666; font-size: 14px; margin-top: 4px;">
          ¡Gracias por ser parte de nuestra historia!
        </div>
      </td>
    </tr>
  </table>
</div>`;

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = 
      attendee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' || 
      attendee.rsvp_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedAttendees.length === filteredAttendees.length) {
      setSelectedAttendees([]);
    } else {
      setSelectedAttendees(filteredAttendees.map(a => a.id));
    }
  };

  const toggleAttendee = (id: string) => {
    if (selectedAttendees.includes(id)) {
      setSelectedAttendees(selectedAttendees.filter(a => a !== id));
    } else {
      setSelectedAttendees([...selectedAttendees, id]);
    }
  };

  const replaceVariables = (text: string, attendee: any) => {
    const currentTable = tables.find(t => t.id === attendee.table_id);
    const currentDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const replacements = {
      '{nombre}': attendee.first_name || '',
      '{apellido}': attendee.last_name || '',
      '{mesa}': currentTable?.name || 'Sin mesa asignada',
      '{fecha}': currentDate,
      '{hora_ceremonia}': landingPage?.ceremony_time || '[Hora no definida]',
      '{hora_fiesta}': landingPage?.party_time || '[Hora no definida]',
      '{lugar_ceremonia}': landingPage?.ceremony_location || '[Lugar no definido]',
      '{lugar_fiesta}': landingPage?.party_location || '[Lugar no definido]',
      '{direccion_ceremonia}': landingPage?.ceremony_address || '[Dirección no definida]',
      '{direccion_fiesta}': landingPage?.party_address || '[Dirección no definida]'
    };

    return text.replace(
      new RegExp(Object.keys(replacements).join('|'), 'g'),
      matched => replacements[matched as keyof typeof replacements]
    );
  };

  const insertVariable = (variable: string) => {
    if (activeInput === 'subject' && subjectRef.current) {
      const start = subjectRef.current.selectionStart || 0;
      const end = subjectRef.current.selectionEnd || 0;
      const newSubject = subject.substring(0, start) + variable + subject.substring(end);
      setSubject(newSubject);
      setTimeout(() => {
        subjectRef.current?.setSelectionRange(start + variable.length, start + variable.length);
        subjectRef.current?.focus();
      }, 0);
    } else if (activeInput === 'message' && messageRef.current) {
      const start = messageRef.current.selectionStart || 0;
      const end = messageRef.current.selectionEnd || 0;
      const newMessage = message.substring(0, start) + variable + message.substring(end);
      setMessage(newMessage);
      setTimeout(() => {
        messageRef.current?.setSelectionRange(start + variable.length, start + variable.length);
        messageRef.current?.focus();
      }, 0);
    }
  };

  const handleSendReminders = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Por favor completa el asunto y el mensaje');
      return;
    }

    if (selectedAttendees.length === 0) {
      toast.error('Por favor selecciona al menos un invitado');
      return;
    }

    setIsSending(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const attendeeId of selectedAttendees) {
        const attendee = attendees.find(a => a.id === attendeeId);
        if (!attendee) continue;

        const personalizedSubject = replaceVariables(subject, attendee);
        const personalizedMessage = replaceVariables(message, attendee) + signature;

        try {
          await sendEmail(
            attendeeId,
            personalizedSubject,
            personalizedMessage
          );
          successCount++;
        } catch (error) {
          console.error('Error sending reminder:', error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Recordatorios enviados a ${successCount} invitados`);
        setSelectedAttendees([]);
      }
      
      if (errorCount > 0) {
        toast.error(`Error al enviar ${errorCount} recordatorios`);
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      toast.error('Error al enviar los recordatorios');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'declined':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recordatorios</h1>
        <p className="text-gray-500 mt-1">
          Envía recordatorios personalizados a tus invitados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guest Selection */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Invitados</CardTitle>
              <div className="flex items-center gap-2">
                <select
                  className="rounded-md border border-gray-300 text-sm py-2 px-3 bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">Todos</option>
                  <option value="pending">Pendientes</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="declined">No Asistirán</option>
                </select>
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {attendeesLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
              </div>
            ) : filteredAttendees.length > 0 ? (
              <div>
                <div className="p-4 border-b border-gray-200">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      checked={selectedAttendees.length === filteredAttendees.length}
                      onChange={handleSelectAll}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Seleccionar todos ({filteredAttendees.length})
                    </span>
                  </label>
                </div>
                <div className="divide-y max-h-[400px] overflow-y-auto">
                  {filteredAttendees.map((attendee) => {
                    const currentTable = tables.find(t => t.id === attendee.table_id);
                    return (
                      <div 
                        key={attendee.id}
                        className="flex items-center p-4 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                          checked={selectedAttendees.includes(attendee.id)}
                          onChange={() => toggleAttendee(attendee.id)}
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {attendee.first_name} {attendee.last_name}
                            </p>
                            <div className="ml-2 flex items-center gap-2">
                              {getStatusIcon(attendee.rsvp_status)}
                              {currentTable && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Table2 className="h-3 w-3 mr-1" />
                                  {currentTable.name}
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{attendee.email}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron invitados</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Variables Disponibles</h3>
                  <div className="flex flex-wrap gap-2">
                    {variables.map((variable) => (
                      <button
                        key={variable.name}
                        onClick={() => insertVariable(variable.name)}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                        title={variable.description}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {variable.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  ref={subjectRef}
                  label="Asunto"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onFocus={() => setActiveInput('subject')}
                  placeholder="Ej: Recordatorio para {nombre}"
                  className="font-mono"
                />

                <Textarea
                  ref={messageRef}
                  label="Mensaje"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setActiveInput('message')}
                  placeholder="Ej: Hola {nombre}, te esperamos en {lugar_ceremonia} a las {hora_ceremonia}..."
                  rows={6}
                  className="font-mono"
                />

                <Button
                  onClick={handleSendReminders}
                  isLoading={isSending}
                  disabled={isSending || selectedAttendees.length === 0 || !subject.trim() || !message.trim()}
                  leftIcon={<Send className="h-4 w-4" />}
                  className='bg-primary hover:bg-primary-dark text-primary-contrast w-full sm:w-auto'
                >
                  Enviar Recordatorios ({selectedAttendees.length})
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vista Previa de la Firma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4">
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${profileImage || 'https://images.pexels.com/photos/931158/pexels-photo-931158.jpeg'})` }} />
                    <div>
                      <div className="text-lg font-serif text-rose-600">
                        {groomName} & {brideName}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        ¡Gracias por ser parte de nuestra historia!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}