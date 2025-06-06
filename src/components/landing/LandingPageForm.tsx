import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Switch } from '../ui/Switch';
import { MusicSelector } from './MusicSelector';
import { MusicUpload } from '../ui/MusicUpload';
import { TemplateSelector } from './TemplateSelector';
import { CoverImageUpload } from '../ui/CoverImageUpload';
import { GalleryUpload } from '../ui/GalleryUpload';
import { PublishSection } from './PublishSection';
import { FloatingSaveButton } from './FloatingSaveButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { templates } from './templates';
import { PlacesAutocomplete } from '../ui/PlacesAutocomplete';

interface LandingPageFormData {
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  welcome_message: string;
  
  ceremony_date: string;
  ceremony_location: string;
  ceremony_time: string;
  ceremony_address: string;
  ceremony_place_id?: string;
  
  party_date: string;
  party_location: string;
  party_time: string;
  party_address: string;
  party_place_id?: string;
  
  music_enabled: boolean;
  selected_track: string;
  hashtag: string;

  // Additional Info
  dress_code: string;
  additional_info: string;

  bank_info: {
    accountHolder: string;
    rut: string;
    bank: string;
    accountType: string;
    accountNumber: string;
    email: string;
  };
}

interface LandingPageFormProps {
  initialData?: Partial<LandingPageFormData> & { 
    published_at?: string | null; 
    slug?: string | null;
    cover_image?: string;
    gallery_images?: { url: string; caption?: string }[];
    template_id?: string;
  };
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface PublishStatus {
  isPublished: boolean;
  slug: string | null;
}

const STORAGE_KEY = 'landing_page_status';

export function LandingPageForm({ initialData, onSuccess, onError }: LandingPageFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialData?.template_id || templates.deluxe.id);
  const [musicEnabled, setMusicEnabled] = useState(initialData?.music_enabled ?? false);
  const [selectedTrack, setSelectedTrack] = useState<string>(initialData?.selected_track || '');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [publishedUrl, setPublishedUrl] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>(initialData?.cover_image || '');
  const [galleryImages, setGalleryImages] = useState<{ url: string; caption?: string }[]>(initialData?.gallery_images || []);
  const [publishedStatus, setPublishedStatus] = useState<PublishStatus>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      isPublished: !!initialData?.published_at,
      slug: initialData?.slug || null
    };
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<LandingPageFormData>({
    defaultValues: {
      music_enabled: false,
      selected_track: '',
      dress_code: initialData?.dress_code || 'Formal',
      additional_info: initialData?.additional_info || 'La celebración será al aire libre',
      bank_info: {
        accountHolder: '',
        rut: '',
        bank: '',
        accountType: '',
        accountNumber: '',
        email: ''
      },
      ...initialData
    }
  });

  const groomName = watch('groom_name');
  const brideName = watch('bride_name');

  React.useEffect(() => {
    if (user) {
      setPreviewUrl(`${window.location.origin}/preview/${user.id}`);
    }
  }, [user]);

  React.useEffect(() => {
    if (groomName && brideName && publishedStatus.slug) {
      setPublishedUrl(`https://tuparte.digital/invitacion/${publishedStatus.slug}`);
    }
  }, [groomName, brideName, publishedStatus.slug]);

  const onSubmit = async (data: LandingPageFormData) => {
    if (!selectedTemplateId) {
      toast.error('Por favor selecciona una plantilla');
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      const { error } = await supabase
        .from('landing_pages')
        .upsert({
          user_id: user?.id,
          ...data,
          template_id: selectedTemplateId,
          wedding_date: new Date(data.wedding_date).toISOString(),
          ceremony_date: data.ceremony_date ? new Date(data.ceremony_date).toISOString() : null,
          party_date: data.party_date ? new Date(data.party_date).toISOString() : null,
          music_enabled: musicEnabled,
          selected_track: selectedTrack,
          cover_image: coverImage,
          gallery_images: galleryImages,
          bank_info: data.bank_info
        });

      if (error) throw error;

      onSuccess?.();
    } catch (error) {
      console.error('Error saving landing page:', error);
      toast.error('Error al guardar los cambios');
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!groomName || !brideName) {
      toast.error('Por favor completa los nombres antes de publicar');
      return;
    }

    setIsPublishing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      const slug = `${groomName.toLowerCase()}-y-${brideName.toLowerCase()}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/publish-landing`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          slug,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        const newStatus = {
          isPublished: true,
          slug: data.data.slug
        };
        setPublishedStatus(newStatus);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatus));
        toast.success('¡Página publicada correctamente!');
      } else {
        throw new Error(data.error || 'Error al publicar la página');
      }
    } catch (error) {
      console.error('Error publishing landing:', error);
      toast.error(error instanceof Error ? error.message : 'Error al publicar la página');
      onError?.(error as Error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    try {
      const { error } = await supabase
        .from('landing_pages')
        .update({ 
          published_at: null,
          slug: null
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      const newStatus = {
        isPublished: false,
        slug: null
      };
      setPublishedStatus(newStatus);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatus));
      toast.success('Página despublicada correctamente');
    } catch (error) {
      console.error('Error unpublishing landing page:', error);
      toast.error('Error al despublicar la página');
      onError?.(error as Error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PublishSection
        previewUrl={previewUrl}
        publishedUrl={publishedUrl}
        publishedStatus={publishedStatus}
        isPublishing={isPublishing}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
      />

      <Card>
        <CardHeader>
          <CardTitle>Plantilla</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateSelector
            selectedTemplateId={selectedTemplateId}
            onSelect={setSelectedTemplateId}
          />
        </CardContent>
      </Card>

      <CoverImageUpload
        value={coverImage}
        onChange={setCoverImage}
        onRemove={() => setCoverImage('')}
      />

      <GalleryUpload
        images={galleryImages}
        onChange={setGalleryImages}
      />

      <Card>
        <CardHeader>
          <CardTitle>Información Principal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del Novio"
              {...register('groom_name', { required: 'El nombre del novio es requerido' })}
              error={errors.groom_name?.message}
            />
            <Input
              label="Nombre de la Novia"
              {...register('bride_name', { required: 'El nombre de la novia es requerido' })}
              error={errors.bride_name?.message}
            />
          </div>
          
          <Input
            type="date"
            label="Fecha de la Boda"
            {...register('wedding_date', { required: 'La fecha es requerida' })}
            error={errors.wedding_date?.message}
          />
          
          <Textarea
            label="Mensaje de Bienvenida"
            {...register('welcome_message')}
            placeholder="Escribe un mensaje de bienvenida para tus invitados..."
          />

          <Input
            label="Hashtag"
            {...register('hashtag')}
            placeholder={`${groomName.replace(/\s+/g, '')}Y${brideName.replace(/\s+/g, '')}2024`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ceremonia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="date"
            label="Fecha"
            {...register('ceremony_date')}
          />
          
          <Input
            label="Lugar"
            {...register('ceremony_location')}
            placeholder="Ej: Iglesia San Francisco"
          />
          
          <Input
            type="time"
            label="Hora"
            {...register('ceremony_time')}
          />
          
          <PlacesAutocomplete
            label="Dirección"
            value={watch('ceremony_address')}
            onChange={(address, placeId) => {
              setValue('ceremony_address', address);
              setValue('ceremony_place_id', placeId);
            }}
            placeholder="Buscar dirección..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fiesta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="date"
            label="Fecha"
            {...register('party_date')}
          />
          
          <Input
            label="Lugar"
            {...register('party_location')}
            placeholder="Ej: Salón de Eventos El Jardín"
          />
          
          <Input
            type="time"
            label="Hora"
            {...register('party_time')}
          />
          
          <PlacesAutocomplete
            label="Dirección"
            value={watch('party_address')}
            onChange={(address, placeId) => {
              setValue('party_address', address);
              setValue('party_place_id', placeId);
            }}
            placeholder="Buscar dirección..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Código de Vestimenta"
            {...register('dress_code', { required: 'El código de vestimenta es requerido' })}
            error={errors.dress_code?.message}
            placeholder="Ej: Formal, Black Tie, Cocktail..."
          />
          
          <Textarea
            label="Información Adicional"
            {...register('additional_info', { required: 'La información adicional es requerida' })}
            error={errors.additional_info?.message}
            placeholder="Ej: La celebración será al aire libre, se recomienda traer abrigo..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos Bancarios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nombre del Titular"
            {...register('bank_info.accountHolder', { required: 'El nombre del titular es requerido' })}
            error={errors.bank_info?.accountHolder?.message}
          />

          <Input
            label="RUT"
            {...register('bank_info.rut', { 
              required: 'El RUT es requerido',
              pattern: {
                value: /^[0-9]{7,8}-[0-9kK]{1}$/,
                message: 'RUT inválido (formato: 12345678-9)'
              }
            })}
            placeholder="12345678-9"
            error={errors.bank_info?.rut?.message}
          />

          <Input
            label="Banco"
            {...register('bank_info.bank', { required: 'El banco es requerido' })}
            error={errors.bank_info?.bank?.message}
          />

          <Input
            label="Tipo de Cuenta"
            {...register('bank_info.accountType', { required: 'El tipo de cuenta es requerido' })}
            placeholder="Cuenta Corriente, Cuenta Vista, etc."
            error={errors.bank_info?.accountType?.message}
          />

          <Input
            label="Número de Cuenta"
            {...register('bank_info.accountNumber', { required: 'El número de cuenta es requerido' })}
            error={errors.bank_info?.accountNumber?.message}
          />

          <Input
            label="Correo Electrónico"
            type="email"
            {...register('bank_info.email', {
              required: 'El correo electrónico es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo electrónico inválido'
              }
            })}
            error={errors.bank_info?.email?.message}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Música</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Habilitar música de fondo</h3>
              <p className="text-sm text-gray-500">La música se reproducirá automáticamente al abrir la invitación</p>
            </div>
            <Switch
              checked={musicEnabled}
              onCheckedChange={setMusicEnabled}
            />
          </div>

          {musicEnabled && (
            <MusicUpload
              value={selectedTrack}
              onChange={setSelectedTrack}
              onRemove={() => setSelectedTrack('')}
              label="Subir música de fondo"
            />
          )}
        </CardContent>
      </Card>

      <FloatingSaveButton isLoading={isLoading} />
    </form>
  );
}