import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getTemplate } from '../components/landing/templates';
import type { TemplateProps } from '../components/landing/templates/types';
import { useAuth } from '../context/AuthContext';

interface LandingPageData {
  id: string;
  user_id: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  welcome_message: string;
  ceremony_date: string;
  ceremony_location: string;
  ceremony_time: string;
  ceremony_address: string;
  party_date: string;
  party_location: string;
  party_time: string;
  party_address: string;
  music_enabled: boolean;
  selected_track: string;
  template_id: string;
  dress_code: string;
  additional_info: string;
  cover_image?: string;
  gallery_images?: any[];
  bank_info?: {
    accountHolder: string;
    rut: string;
    bank: string;
    accountType: string;
    accountNumber: string;
    email: string;
  };
  hashtag: string;
}

export function PreviewPage() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user is trying to access someone else's preview
  if (user.id !== userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permiso para ver esta página</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          throw new Error('User ID is required');
        }

        const { data, error } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('No landing page found');

        setLandingData(data);
      } catch (error) {
        setError('Error loading preview');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (error || !landingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error || 'Preview not found'}</p>
        </div>
      </div>
    );
  }

  const template = getTemplate(landingData.template_id);
  const TemplateComponent = template.component;

  const templateProps: TemplateProps = {
    groomName: landingData.groom_name,
    brideName: landingData.bride_name,
    weddingDate: landingData.wedding_date,
    welcomeMessage: landingData.welcome_message,
    hashtag: landingData.hashtag,
    ceremonyDate: landingData.ceremony_date,
    ceremonyTime: landingData.ceremony_time,
    ceremonyLocation: landingData.ceremony_location,
    ceremonyAddress: landingData.ceremony_address,
    partyDate: landingData.party_date,
    partyTime: landingData.party_time,
    partyLocation: landingData.party_location,
    partyAddress: landingData.party_address,
    musicEnabled: landingData.music_enabled,
    musicUrl: landingData.selected_track,
    coverImage: landingData.cover_image,
    galleryImages: landingData.gallery_images?.map(img => img.url),
    userId: userId,
    bankInfo: landingData.bank_info,
    dress_code: landingData.dress_code,
    additional_info: landingData.additional_info
  };

  return <TemplateComponent {...templateProps} />;
}