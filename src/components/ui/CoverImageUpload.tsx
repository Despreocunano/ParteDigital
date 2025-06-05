import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { ImageUpload } from './ImageUpload';

interface CoverImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function CoverImageUpload({
  value,
  onChange,
  onRemove,
  className = ''
}: CoverImageUploadProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Imagen de Portada</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Esta imagen será la primera que verán tus invitados. Recomendamos una imagen horizontal de alta calidad.
          </p>
          <ImageUpload
            value={value}
            onChange={onChange}
            onRemove={onRemove}
            label="Subir imagen de portada"
          />
        </div>
      </CardContent>
    </Card>
  );
}