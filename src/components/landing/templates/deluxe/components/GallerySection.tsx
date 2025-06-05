import React from 'react';
import { Gallery } from '../../../shared/Gallery';

interface GallerySectionProps {
  images: string[];
  className?: string;
}

export function GallerySection({ images, className = '' }: GallerySectionProps) {
  if (!images?.length) return null;

  return (
    <Gallery 
      images={images}
      frameColor="#D4B572"
      className={className}
    />
  );
}