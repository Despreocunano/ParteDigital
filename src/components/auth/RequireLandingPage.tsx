import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { FeatureLockModal } from '../ui/FeatureLockModal';

interface RequireLandingPageProps {
  children: React.ReactNode;
}

export function RequireLandingPage({ children }: RequireLandingPageProps) {
  const { user, hasLandingPage, setHasLandingPage } = useAuth();

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
        setHasLandingPage(false);
      }
    };

    checkLandingPage();
  }, [user, setHasLandingPage]);

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