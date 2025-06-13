import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { FeatureLockModal } from '../ui/FeatureLockModal';

interface RequireLandingPageProps {
  children: React.ReactNode;
}

export function RequireLandingPage({ children }: RequireLandingPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasLandingPage, setHasLandingPage] = useState(false);

  useEffect(() => {
    const checkLandingPage = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('landing_pages')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setHasLandingPage(!!data);
      } catch (error) {
        console.error('Error checking landing page:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLandingPage();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <>
      {children}
      <FeatureLockModal
        isOpen={!hasLandingPage}
        title="¡Crea tu invitación digital!"
        description="Para acceder a esta sección, primero necesitas crear tu invitación digital. ¡Es rápido y fácil!"
        actionText="Crear invitación"
        actionPath="/landing"
      />
    </>
  );
} 