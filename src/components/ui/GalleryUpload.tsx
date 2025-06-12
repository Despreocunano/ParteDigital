import React, { useRef } from 'react';
import { Card, CardContent } from './Card';
import { Plus, X, Upload } from 'lucide-react';
import { Button } from './Button';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface GalleryImage {
  url: string;
  caption?: string;
}

interface GalleryUploadProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  className?: string;
}

export function GalleryUpload({
  images,
  onChange,
  className = ''
}: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate number of images
    const totalImages = images.length + files.length;
    if (totalImages < 6) {
      toast.error('Por favor selecciona al menos 6 fotos en total');
      return;
    }
    if (totalImages > 9) {
      toast.error('El máximo permitido es de 9 fotos');
      return;
    }

    setIsUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      const uploadPromises = files.map(async (file) => {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`La imagen ${file.name} es demasiado grande. Máximo 10MB.`);
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`El archivo ${file.name} no es una imagen válida.`);
        }

        // Generate unique filename
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExt = file.name.split('.').pop();
        const fileName = `${timestamp}-${randomString}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;

        // Upload file
        const { error: uploadError } = await supabase.storage
          .from('landing-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('landing-images')
          .getPublicUrl(filePath);

        return { url: publicUrl };
      });

      const newImages = await Promise.all(uploadPromises);
      onChange([...images, ...newImages]);
      toast.success('Imágenes subidas correctamente');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(error instanceof Error ? error.message : 'Error al subir las imágenes');
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleImageRemove = async (index: number) => {
    if (images.length <= 6) {
      toast.error('Debes mantener al menos 6 fotos');
      return;
    }

    try {
      const imageToRemove = images[index];
      const url = new URL(imageToRemove.url);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('landing-images') + 1).join('/');

      const { error } = await supabase.storage
        .from('landing-images')
        .remove([filePath]);

      if (error) throw error;

      const newImages = [...images];
      newImages.splice(index, 1);
      onChange(newImages);
      toast.success('Imagen eliminada correctamente');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Error al eliminar la imagen');
    }
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Agrega entre 6 y 9 fotos a tu galería para compartir momentos especiales con tus invitados.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={image.url}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleImageRemove(index)}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          {images.length < 9 && (
            <div className="aspect-square">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {images.length === 0 ? 'Subir fotos' : 'Agregar más fotos'}
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
          <span className={images.length < 6 ? 'text-red-500' : 'text-green-500'}>
            {images.length}/9
          </span>
          fotos seleccionadas (mínimo 6)
        </div>
      </div>
    </div>
  );
}