import React from 'react';
import { MusicPlayer } from '../shared/MusicPlayer';

interface BaseTemplateProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  children: React.ReactNode;
  musicEnabled?: boolean;
  musicUrl?: string;
  autoplayMusic?: boolean;
  onMusicToggle?: (enabled: boolean) => void;
}

export function BaseTemplate({
  groomName,
  brideName,
  weddingDate,
  children,
  musicEnabled = false,
  musicUrl,
  autoplayMusic = false,
  onMusicToggle
}: BaseTemplateProps) {
  return (
    <div className="min-h-screen">
      {musicEnabled && musicUrl && (
        <MusicPlayer 
          url={musicUrl}
          color="#D4B572"
          autoplay={autoplayMusic}
        />
      )}
      {children}
    </div>
  );
}