import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Switch } from '../ui/Switch';
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
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';
import { Grid } from 'lucide-react';
import { Select } from '../ui/Select';
import { PRICING } from '../../config/pricing';

interface LandingPageFormData {
  groom_name: string;
  bride_name: string;
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

  accepts_kids: boolean;
  accepts_pets: boolean;

  couple_code: string;
  store: string;

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

// Función para validar RUT chileno
const validateRut = (rut: string): boolean => {
  // Eliminar puntos y guión
  const cleanRut = rut.replace(/[.-]/g, '');
  
  // Verificar formato básico
  if (!/^[0-9]{7,8}[0-9kK]{1}$/.test(cleanRut)) {
    return false;
  }

  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();

  // 1. Invertir el número
  const rutReversed = rutNumber.split('').reverse().join('');

  // 2. Multiplicar por la serie 2,3,4,5,6,7
  let sum = 0;
  const serie = [2, 3, 4, 5, 6, 7];
  
  for (let i = 0; i < rutReversed.length; i++) {
    const digit = parseInt(rutReversed[i]);
    const multiplier = serie[i % serie.length];
    sum += digit * multiplier;
  }

  // 3. Dividir por 11 y obtener el resto
  const remainder = sum % 11;

  // 4. Calcular el dígito verificador
  const calculatedDv = 11 - remainder;
  const finalDv = calculatedDv === 11 ? '0' : calculatedDv === 10 ? 'K' : calculatedDv.toString();

  return finalDv === dv;
};

export function LandingPageForm({ initialData, onSuccess, onError }: LandingPageFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialData?.template_id || templates.deluxe.id);
  const [musicEnabled, setMusicEnabled] = useState(initialData?.music_enabled ?? false);
  const [selectedTrack, setSelectedTrack] = useState<string>(initialData?.selected_track || '');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [publishedUrl, setPublishedUrl] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>(initialData?.cover_image || '');
  const [galleryImages, setGalleryImages] = useState<{ url: string; caption?: string }[]>(initialData?.gallery_images || []);
  const [publishedStatus, setPublishedStatus] = useState<PublishStatus>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { isPublished: false, slug: null };
  });
  const [userNames, setUserNames] = useState<{ groom_name: string; bride_name: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCustomDressCode, setShowCustomDressCode] = useState(false);
  const [selectedDressCode, setSelectedDressCode] = useState(initialData?.dress_code || 'formal');
  const [selectedAccountType, setSelectedAccountType] = useState(initialData?.bank_info?.accountType || '');
  const [rutError, setRutError] = useState<string | null>(null);
  const [rutValue, setRutValue] = useState(initialData?.bank_info?.rut || '');
  const [selectedStore, setSelectedStore] = useState(initialData?.store || '');
  const [publishPrice, setPublishPrice] = useState(PRICING.PUBLISH.DEFAULT);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<LandingPageFormData>({
    defaultValues: {
      groom_name: initialData?.groom_name || userNames?.groom_name || '',
      bride_name: initialData?.bride_name || userNames?.bride_name || '',
      welcome_message: initialData?.welcome_message || '',
      ceremony_date: initialData?.ceremony_date || '',
      ceremony_location: initialData?.ceremony_location || '',
      ceremony_time: initialData?.ceremony_time || '',
      ceremony_address: initialData?.ceremony_address || '',
      ceremony_place_id: initialData?.ceremony_place_id,
      party_date: initialData?.party_date || '',
      party_location: initialData?.party_location || '',
      party_time: initialData?.party_time || '',
      party_address: initialData?.party_address || '',
      party_place_id: initialData?.party_place_id,
      dress_code: initialData?.dress_code || '',
      additional_info: initialData?.additional_info || '',
      hashtag: initialData?.hashtag || '',
      accepts_kids: initialData?.accepts_kids ?? false,
      accepts_pets: initialData?.accepts_pets ?? false,
      couple_code: initialData?.couple_code || '',
      store: initialData?.store || '',
      bank_info: initialData?.bank_info || {
        accountHolder: '',
        rut: '',
        bank: '',
        accountType: '',
        accountNumber: '',
        email: ''
      }
    }
  });

  const coupleCode = watch('couple_code');

  const dressCodeOptions = [
    { value: 'Formal', label: 'Formal' },
    { value: 'Black tie', label: 'Black Tie' },
    { value: 'Cocktail', label: 'Cocktail' },
    { value: 'Semi formal', label: 'Semi Formal' },
    { value: 'Casual elegante', label: 'Casual Elegante' },
    { value: 'custom', label: 'Otro' }
  ];

  const accountTypeOptions = [
    { value: 'Cuenta corriente', label: 'Cuenta Corriente' },
    { value: 'Cuenta vista', label: 'Cuenta Vista' },
    { value: 'Cuenta RUT', label: 'Cuenta RUT' }
  ];

  const storeOptions = [
    { value: 'falabella', label: 'Falabella' },
    { value: 'paris', label: 'Paris' }
  ];

  // Fetch user names from users table
  useEffect(() => {
    const fetchUserNames = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('groom_name, bride_name')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          setUserNames(data);
        }
      } catch (error) {
        console.error('Error fetching user names:', error);
      }
    };

    fetchUserNames();
  }, [user?.id]);

  // Update form values when userNames are loaded
  useEffect(() => {
    if (userNames && !initialData?.groom_name && !initialData?.bride_name) {
      setValue('groom_name', userNames.groom_name);
      setValue('bride_name', userNames.bride_name);
    }
  }, [userNames, initialData, setValue]);

  const groomName = watch('groom_name');
  const brideName = watch('bride_name');
  const ceremonyDate = watch('ceremony_date');
  const ceremonyLocation = watch('ceremony_location');
  const ceremonyTime = watch('ceremony_time');
  const ceremonyAddress = watch('ceremony_address');
  const partyDate = watch('party_date');
  const partyLocation = watch('party_location');
  const partyTime = watch('party_time');
  const partyAddress = watch('party_address');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

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

  // Watch for changes in form values
  const formValues = watch();
  useEffect(() => {
    const hasFormChanges = Object.keys(formValues).some(key => {
      const value = formValues[key as keyof typeof formValues];
      const initialValue = initialData?.[key as keyof typeof initialData];
      return JSON.stringify(value) !== JSON.stringify(initialValue);
    });

    const hasOtherChanges = 
      musicEnabled !== (initialData?.music_enabled || false) ||
      selectedTrack !== (initialData?.selected_track || '') ||
      coverImage !== (initialData?.cover_image || '') ||
      JSON.stringify(galleryImages) !== JSON.stringify(initialData?.gallery_images || []) ||
      selectedTemplateId !== (initialData?.template_id || templates.deluxe.id);

    setHasChanges(hasFormChanges || hasOtherChanges);
  }, [formValues, musicEnabled, selectedTrack, coverImage, galleryImages, selectedTemplateId, initialData]);

  const onSubmit = async (data: LandingPageFormData) => {
    if (!selectedTemplateId) {
      toast.error('Por favor selecciona una plantilla');
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      // First, get the existing landing page if it exists
      const { data: existingPage } = await supabase
        .from('landing_pages')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      // Clean hashtag by removing # if present
      const cleanHashtag = data.hashtag.replace(/^#/, '');

      const adjustDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toISOString();
      };

      const { error } = await supabase
        .from('landing_pages')
        .upsert({
          id: existingPage?.id, // Include the id if it exists
          user_id: user?.id,
          ...data,
          hashtag: cleanHashtag, // Use cleaned hashtag
          template_id: selectedTemplateId,
          wedding_date: adjustDate(data.ceremony_date),
          ceremony_date: adjustDate(data.ceremony_date),
          party_date: adjustDate(data.party_date),
          music_enabled: musicEnabled,
          selected_track: selectedTrack,
          cover_image: coverImage,
          gallery_images: galleryImages,
          bank_info: data.bank_info
        });

      if (error) throw error;

      toast.success(
        !existingPage
          ? 'Invitación creada correctamente'
          : 'Cambios guardados correctamente'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      // Refresh the session first
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) throw refreshError;
      if (!refreshedSession) throw new Error('No authenticated session');

      // Create payment preference
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshedSession.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          amount: publishPrice,
          description: 'Publicación de invitación digital',
          paymentType: 'publish'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Payment API error response:", errorText);
        throw new Error(`Error en la respuesta del API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.init_point) {
        // Redirect to MercadoPago checkout
        window.location.href = data.init_point;
      } else {
        throw new Error(data.error || 'Error al crear el pago');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar el pago');
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

  const hasRequiredInfo = Boolean(
    groomName &&
    brideName &&
    ceremonyDate &&
    ceremonyLocation &&
    ceremonyTime &&
    ceremonyAddress &&
    partyDate &&
    partyLocation &&
    partyTime &&
    partyAddress &&
    selectedTemplateId
  );

  const formatRut = (value: string) => {
    // Eliminar todo excepto números y k
    const cleanValue = value.replace(/[^0-9kK]/g, '');
    
    // Si está vacío, retornar vacío
    if (!cleanValue) return '';
    
    // Separar número y dígito verificador
    const rutNumber = cleanValue.slice(0, -1);
    const dv = cleanValue.slice(-1).toUpperCase();
    
    // Formatear número con guión
    return `${rutNumber}-${dv}`;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatRut(e.target.value);
    setRutValue(formattedValue);
    setValue('bank_info.rut', formattedValue);

    // Validar en tiempo real
    if (formattedValue) {
      if (!/^[0-9]{7,8}-[0-9kK]{1}$/.test(formattedValue)) {
        setRutError('Formato de RUT inválido (ej: 12345678-9)');
      } else if (!validateRut(formattedValue)) {
        setRutError('RUT inválido');
      } else {
        setRutError(null);
      }
    } else {
      setRutError(null);
    }
  };

  // Efecto para cargar el estado de publicación desde el servidor
  useEffect(() => {
    const loadPublishStatus = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('landing_pages')
          .select('published_at, slug')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          const newStatus = {
            isPublished: !!data.published_at,
            slug: data.slug
          };
          setPublishedStatus(newStatus);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatus));
          
          if (data.slug) {
            setPublishedUrl(`https://tuparte.digital/invitacion/${data.slug}`);
          }
        }
      } catch (error) {
        console.error('Error loading publish status:', error);
      }
    };
    
    loadPublishStatus();
  }, [user?.id]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <PublishSection
        previewUrl={previewUrl}
        publishedUrl={publishedUrl}
        publishedStatus={publishedStatus}
        isPublishing={isPublishing}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        hasRequiredInfo={hasRequiredInfo}
        publishPrice={publishPrice}
      />

      {!publishedStatus.isPublished && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Recuerda publicar tu invitación
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  Tu invitación ha sido creada pero no está publicada. Debes publicarla para poder compartirla con tus invitados.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="text-rose-600 font-medium">1</span>
              </div>
              <CardTitle>Selecciona el diseño</CardTitle>
            </div>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAllTemplates(true);
              }}
              leftIcon={<Grid className="h-4 w-4" />}
              className='border border-primary text-primary hover:bg-primary-dark hover:text-primary-contrast'
            >
              Ver todas las plantillas
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <TemplateSelector
            selectedTemplateId={selectedTemplateId}
            onSelect={setSelectedTemplateId}
            showAllTemplates={showAllTemplates}
            setShowAllTemplates={setShowAllTemplates}
          />
        </CardContent>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">2</span>
            </div>
            <CardTitle>Nombres</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
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
        </CardContent>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">3</span>
            </div>
            <CardTitle>Mensaje de Bienvenida</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <div className="space-y-4">
            <Textarea
              label="Mensaje de Bienvenida"
              {...register('welcome_message', {
                maxLength: {
                  value: 120,
                  message: 'El mensaje no puede tener más de 120 caracteres'
                }
              })}
              error={errors.welcome_message?.message}
              placeholder="Escribe un mensaje de bienvenida para tus invitados..."
              maxLength={120}
            />
            <div className="text-sm text-gray-500 text-right">
              {watch('welcome_message')?.length || 0}/120 caracteres
            </div>
            <Input
              label="Hashtag"
              {...register('hashtag')}
              error={errors.hashtag?.message}
              placeholder="Ej: #JuanYMaria2024"
            />
          </div>
        </CardContent>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <CardHeader className="px-0 pt-0 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="text-rose-600 font-medium">4</span>
              </div>
              <CardTitle>Imagen de portada</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <CoverImageUpload
              value={coverImage}
              onChange={setCoverImage}
              onRemove={() => setCoverImage('')}
            />
          </CardContent>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <CardHeader className="px-0 pt-0 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="text-rose-600 font-medium">5</span>
              </div>
              <CardTitle>Galería de fotos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <GalleryUpload
              images={galleryImages}
              onChange={setGalleryImages}
            />
          </CardContent>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">6</span>
            </div>
            <CardTitle>Ceremonia</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Fecha de la Ceremonia"
              {...register('ceremony_date', {
                required: 'La fecha de la ceremonia es requerida',
                validate: (value) => {
                  if (new Date(value) < new Date(today)) {
                    return 'La fecha debe ser futura';
                  }
                  return true;
                }
              })}
              error={errors.ceremony_date?.message}
              min={today}
              onChange={(e) => {
                const ceremonyDate = e.target.value;
                setValue('ceremony_date', ceremonyDate);
                const currentPartyDate = watch('party_date');
                if (!currentPartyDate || currentPartyDate === watch('ceremony_date')) {
                  setValue('party_date', ceremonyDate);
                }
              }}
            />
            <Input
              label="Hora de la Ceremonia"
              type="time"
              {...register('ceremony_time')}
            />
            <div className="md:col-span-2">
              <Input
                label="Lugar de la Ceremonia"
                {...register('ceremony_location', { required: 'El lugar es requerido' })}
                error={errors.ceremony_location?.message}
                placeholder="Iglesia San Sebastián"
                autoComplete="off"
                role="textbox"
                aria-autocomplete="none"
              />
            </div>
            <div className="md:col-span-2">
              <PlacesAutocomplete
                label="Dirección de la Ceremonia"
                value={watch('ceremony_address')}
                onChange={(address, placeId) => {
                  setValue('ceremony_address', address);
                  setValue('ceremony_place_id', placeId);
                }}
                placeholder="Buscar dirección..."
              />
            </div>
          </div>
        </CardContent>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">7</span>
            </div>
            <CardTitle>Recepción</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha de la recepción"
              type="date"
              min={today}
              {...register('party_date', { 
                required: 'La fecha es requerida',
                validate: value => {
                  const date = new Date(value);
                  return date >= new Date() || 'La fecha debe ser futura';
                }
              })}
              error={errors.party_date?.message}
            />
            <Input
              label="Hora de la recepción"
              type="time"
              {...register('party_time', { required: 'La hora es requerida' })}
              error={errors.party_time?.message}
            />
            <div className="md:col-span-2">
              <Input
                label="Lugar de la recepción"
                {...register('party_location', { required: 'El lugar es requerido' })}
                error={errors.party_location?.message}
                placeholder="Estadio Español"
                autoComplete="off"
                role="textbox"
                aria-autocomplete="none"
              />
            </div>
            <div className="md:col-span-2">
              <PlacesAutocomplete
                label="Dirección de la recepción"
                value={watch('party_address')}
                onChange={(address, placeId) => {
                  setValue('party_address', address);
                  setValue('party_place_id', placeId);
                }}
                error={errors.party_address?.message}
                placeholder="Buscar dirección..."
              />
            </div>
          </div>
        </CardContent>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">8</span>
            </div>
            <CardTitle>Información Adicional</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Código de Vestimenta</label>
            <Select
              value={selectedDressCode === 'custom' ? 'custom' : watch('dress_code')}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value;
                setSelectedDressCode(value);
                if (value === 'custom') {
                  setShowCustomDressCode(true);
                  setValue('dress_code', '');
                } else {
                  setShowCustomDressCode(false);
                  setValue('dress_code', value);
                }
              }}
              options={dressCodeOptions}
              error={errors.dress_code?.message}
            />
            {showCustomDressCode && (
              <Input
                {...register('dress_code', { required: 'El código de vestimenta es requerido' })}
                placeholder="Especifica el código de vestimenta"
                error={errors.dress_code?.message}
              />
            )}
          </div>
          
          <Textarea
            label="Información Adicional"
            {...register('additional_info')}
            placeholder="Información adicional para tus invitados..."
          />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">¿Aceptas niños?</label>
                <p className="text-sm text-gray-500">Informa a tus invitados que se permite llevar niños</p>
              </div>
              <Switch
                checked={!!watch('accepts_kids')}
                onCheckedChange={(checked) => setValue('accepts_kids', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">¿Aceptas mascotas?</label>
                <p className="text-sm text-gray-500">Informa a tus invitados que tu boda será pet friendly</p>
              </div>
              <Switch
                checked={!!watch('accepts_pets')}
                onCheckedChange={(checked) => setValue('accepts_pets', checked)}
              />
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6">
          </div>
        </CardContent>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">9</span>
            </div>
            <CardTitle>Información Bancaria</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Bancaria</h3>
            <p className="text-sm text-gray-500 mb-4">
              Esta información será visible para tus invitados en la invitación.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Titular de la cuenta"
                {...register('bank_info.accountHolder', { required: 'El titular es requerido' })}
                error={errors.bank_info?.accountHolder?.message}
                placeholder="Nombre del titular de la cuenta"
              />
              <Input
                label="RUT"
                {...register('bank_info.rut', { required: 'El RUT es requerido' })}
                error={errors.bank_info?.rut?.message}
                placeholder="12345678-9"
                value={rutValue}
                onChange={handleRutChange}
              />
              <Input
                label="Banco"
                {...register('bank_info.bank', { required: 'El banco es requerido' })}
                error={errors.bank_info?.bank?.message}
                placeholder="Nombre del banco"
              />
              <Select
                label="Tipo de cuenta"
                value={watch('bank_info.accountType')}
                onChange={(e) => setValue('bank_info.accountType', e.target.value)}
                error={errors.bank_info?.accountType?.message}
                options={[
                  { value: '', label: 'Selecciona un tipo de cuenta' },
                  { value: 'Cuenta Corriente', label: 'Cuenta Corriente' },
                  { value: 'Cuenta Vista', label: 'Cuenta Vista' },
                  { value: 'Cuenta RUT', label: 'Cuenta RUT' }
                ]}
              />
              <Input
                label="Número de cuenta"
                {...register('bank_info.accountNumber', { required: 'El número de cuenta es requerido' })}
                error={errors.bank_info?.accountNumber?.message}
                placeholder="Número de cuenta"
              />
              <Input
                label="Email para transferencias"
                {...register('bank_info.email', { 
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                error={errors.bank_info?.email?.message}
                placeholder="Email para recibir comprobantes"
              />
            </div>
          </div>
        </CardContent>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">10</span>
            </div>
            <CardTitle>Regalo</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <div className="space-y-4">
            <Input
              label="Código de Novios"
              {...register('couple_code')}
              error={errors.couple_code?.message}
              placeholder="Ingresa el código de novios"
            />
            <Select
              label="Tienda"
              {...register('store')}
              options={storeOptions}
              disabled={!coupleCode}
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
            />
            {!coupleCode && (
              <p className="text-sm text-gray-500">
                Ingresa un código de novios para seleccionar la tienda
              </p>
            )}
          </div>
        </CardContent>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">11</span>
            </div>
            <CardTitle>Música</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6 space-y-4">
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
      </div>

      <div className="bg-white rounded-lg border p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">12</span>
            </div>
            <CardTitle>Precio de Publicación</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio para publicar la invitación (CLP)
              </label>
              <Input
                type="number"
                min={PRICING.PUBLISH.MIN}
                max={PRICING.PUBLISH.MAX}
                value={publishPrice}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= PRICING.PUBLISH.MIN && value <= PRICING.PUBLISH.MAX) {
                    setPublishPrice(value);
                  }
                }}
                placeholder="Precio en CLP"
              />
              <p className="text-sm text-gray-500 mt-1">
                Este es el precio que se cobrará al publicar la invitación.
              </p>
            </div>
          </div>
        </CardContent>
      </div>

      {hasChanges && <FloatingSaveButton isLoading={isLoading} />}
    </form>
  );
}