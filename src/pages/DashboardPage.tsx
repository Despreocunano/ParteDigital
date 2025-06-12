import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Globe, UserPlus, Grid, Send, Music } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
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
            <p className="text-gray-500 mb-4">
              Gestiona tu lista de invitados y sus confirmaciones
            </p>
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
              Organiza las mesas para tu evento
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
              Gestiona las sugerencias musicales de tus invitados
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