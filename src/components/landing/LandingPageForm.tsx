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

  const dressCodeOptions = [
    { value: 'formal', label: 'Formal' },
    { value: 'black_tie', label: 'Black Tie' },
    { value: 'cocktail', label: 'Cocktail' },
    { value: 'semi_formal', label: 'Semi Formal' },
    { value: 'casual_elegante', label: 'Casual Elegante' },
    { value: 'custom', label: 'Otro' }
  ];

  const accountTypeOptions = [
    { value: 'cuenta_corriente', label: 'Cuenta Corriente' },
    { value: 'cuenta_vista', label: 'Cuenta Vista' },
    { value: 'cuenta_rut', label: 'Cuenta RUT' }
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

      // Adjust dates to prevent timezone issues
      const adjustDate = (dateStr: string) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date.toISOString();
      };

      const { error } = await supabase
        .from('landing_pages')
        .upsert({
          id: existingPage?.id, // Include the id if it exists
          user_id: user?.id,
          ...data,
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

      toast.success('Cambios guardados correctamente');
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

      const slug = `${groomName.toLowerCase()}-y-${brideName.toLowerCase()}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/publish-landing`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshedSession.access_token}`,
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
      />

      <Card>
        <CardHeader>
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
            >
              Ver todas las plantillas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TemplateSelector
            selectedTemplateId={selectedTemplateId}
            onSelect={setSelectedTemplateId}
            showAllTemplates={showAllTemplates}
            setShowAllTemplates={setShowAllTemplates}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">2</span>
            </div>
            <CardTitle>Imagen de portada</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CoverImageUpload
            value={coverImage}
            onChange={setCoverImage}
            onRemove={() => setCoverImage('')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">3</span>
            </div>
            <CardTitle>Galería de fotos</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <GalleryUpload
            images={galleryImages}
            onChange={setGalleryImages}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">4</span>
            </div>
            <CardTitle>Información de la celebración</CardTitle>
          </div>
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
          
          <Textarea
            label="Mensaje de Bienvenida"
            {...register('welcome_message', {
              maxLength: {
                value: 120,
                message: 'El mensaje no puede tener más de 200 caracteres'
              }
            })}
            placeholder="Escribe un mensaje de bienvenida para tus invitados..."
            error={errors.welcome_message?.message}
            maxLength={120}
            showCharacterCount
            value={watch('welcome_message')}
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">5</span>
            </div>
            <CardTitle>Información bancaria</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Titular de la Cuenta"
              {...register('bank_info.accountHolder', { required: 'El titular es requerido' })}
              error={errors.bank_info?.accountHolder?.message}
              placeholder="Nombre completo del titular"
            />
            <Input
              label="RUT"
              value={rutValue}
              onChange={handleRutChange}
              error={rutError || undefined}
              placeholder="12345678-9"
              maxLength={10}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tipo de Cuenta</label>
              <Select
                value={selectedAccountType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const value = e.target.value;
                  setSelectedAccountType(value);
                  setValue('bank_info.accountType', value);
                  if (value === 'cuenta_rut') {
                    setValue('bank_info.bank', 'Banco Estado');
                  } else {
                    setValue('bank_info.bank', '');
                  }
                }}
                options={accountTypeOptions}
                error={errors.bank_info?.accountType?.message}
              />
            </div>
            <Input
              label="Banco"
              {...register('bank_info.bank', { required: 'El banco es requerido' })}
              error={errors.bank_info?.bank?.message}
              disabled={selectedAccountType === 'cuenta_rut'}
              value={selectedAccountType === 'cuenta_rut' ? 'Banco Estado' : watch('bank_info.bank')}
              placeholder="Nombre del banco"
            />
            <Input
              label="Número de Cuenta"
              {...register('bank_info.accountNumber', { required: 'El número de cuenta es requerido' })}
              error={errors.bank_info?.accountNumber?.message}
              placeholder="Número de cuenta sin guiones ni espacios"
            />
            <Input
              label="Email"
              type="email"
              {...register('bank_info.email', { 
                required: 'El email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              error={errors.bank_info?.email?.message}
              placeholder="correo@ejemplo.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">6</span>
            </div>
            <CardTitle>Música</CardTitle>
          </div>
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

      {hasChanges && <FloatingSaveButton isLoading={isLoading} />}
    </form>
  );
}