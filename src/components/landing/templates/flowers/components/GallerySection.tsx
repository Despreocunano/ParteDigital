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
      frameColor="#B76E79"
      className={className}
    />
  );
}