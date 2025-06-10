import { useEffect, useState } from 'react';
import { LandingPageForm } from '../components/landing/LandingPageForm';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function LandingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [landingData, setLandingData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const fetchLandingPage = async () => {
      try {
        const { data, error } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          // Format dates for form inputs
          const formattedData = {
            ...data,
            wedding_date: data.wedding_date?.split('T')[0],
            ceremony_date: data.ceremony_date?.split('T')[0],
            party_date: data.party_date?.split('T')[0],
          };
          setLandingData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching landing page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPage();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invitación Digital</h1>
        <p className="text-gray-500 mt-1">
          Personaliza tu invitación digital con toda la información importante para tus invitados
        </p>
      </div>

      {landingData ? (
        <LandingPageForm
          initialData={landingData}
          onSuccess={() => toast.success('Cambios guardados correctamente')}
          onError={() => toast.error('Error al guardar los cambios')}
        />
      ) : (
        <Card>
          <div className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Crea tu Página de Invitación
              </h3>
              <p className="text-gray-500 mb-4">
                Aún no has creado tu invitación digital. Completa el formulario para comenzar.
              </p>
              <LandingPageForm
                onSuccess={() => toast.success('Página creada correctamente')}
                onError={() => toast.error('Error al crear la página')}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}