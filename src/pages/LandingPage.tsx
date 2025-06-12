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

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          // Format dates for form inputs
          const formattedData = {
            ...data,
            wedding_date: data.wedding_date?.split('T')[0] || '',
            ceremony_date: data.ceremony_date?.split('T')[0] || '',
            party_date: data.party_date?.split('T')[0] || '',
          };
          setLandingData(formattedData);
        } else {
          // If no data exists, set empty landing data
          setLandingData({
            groom_name: '',
            bride_name: '',
            wedding_date: '',
            welcome_message: '',
            ceremony_date: '',
            ceremony_location: '',
            ceremony_time: '',
            ceremony_address: '',
            party_date: '',
            party_location: '',
            party_time: '',
            party_address: '',
            music_enabled: false,
            selected_track: '',
            hashtag: '',
            dress_code: '',
            additional_info: '',
            bank_info: {
              accountHolder: '',
              rut: '',
              bank: '',
              accountType: '',
              accountNumber: '',
              email: ''
            }
          });
        }
      } catch (error) {
        console.error('Error fetching landing page:', error);
        toast.error('Error al cargar los datos de la invitación');
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
    <div className="container mx-auto px-4 py-8 max-w-full overflow-x-hidden">
      <Card className="p-4 sm:p-6">
        <LandingPageForm 
          initialData={landingData} 
          onError={() => toast.error('Error al guardar los cambios')}
        />
      </Card>
    </div>
  );
}