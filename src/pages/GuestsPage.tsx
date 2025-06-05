import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UserPlus } from 'lucide-react';

export function GuestsPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invitados</h1>
        <p className="text-gray-500 mt-1">
          Esta página ha sido reemplazada por la nueva sección de Asistentes
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <UserPlus className="h-12 w-12 text-rose-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nueva Sección de Asistentes
            </h2>
            <p className="text-gray-500 mb-6">
              Hemos mejorado la gestión de invitados con nuevas funcionalidades.
              Ahora puedes gestionar mejor la información de tus invitados, incluyendo
              acompañantes, alojamiento y más.
            </p>
            <Button
              onClick={() => navigate('/attendees')}
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              Ir a Asistentes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}