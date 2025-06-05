import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getTemplate } from '../components/landing/templates';
import type { TemplateProps } from '../components/landing/templates/types';

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
}

export function PublicSitePage() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slug) {
          throw new Error('Slug is required');
        }

        const { data, error } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('slug', slug)
          .not('published_at', 'is', null)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Page not found');

        setLandingData(data);

        // Update page title and description
        document.title = `Boda de ${data.groom_name} y ${data.bride_name}`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          const date = new Date(data.wedding_date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          const time = data.ceremony_time || '';
          const location = data.ceremony_location || '';
          metaDescription.setAttribute('content', 
            `Te invitamos a celebrar nuestra boda el ${date}${time ? ` a las ${time}` : ''}${location ? ` en ${location}` : ''}. ¡Acompáñanos en este día tan especial!`
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Page not found');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

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
          <p className="text-gray-600">{error || 'Page not found'}</p>
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
    userId: landingData.user_id,
    bankInfo: landingData.bank_info
  };

  return <TemplateComponent {...templateProps} />;
}