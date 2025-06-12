import { useEffect, useState } from 'react';
import { LandingPageForm } from '../components/landing/LandingPageForm';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function LandingPage() {
  const { user, setHasLandingPage } = useAuth();
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

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setLandingData(data);
        setHasLandingPage(!!data);
      } catch (error) {
        console.error('Error fetching landing page:', error);
        setHasLandingPage(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPage();
  }, [user, setHasLandingPage]);

  const handleSuccess = () => {
    setHasLandingPage(true);
    toast.success('¡Invitación guardada correctamente!');
  };

  const handleError = (error: Error) => {
    console.error('Error saving landing page:', error);
    toast.error('Error al guardar la invitación');
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
      <Card>
        <LandingPageForm
          initialData={landingData}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </Card>
    </div>
  );
}