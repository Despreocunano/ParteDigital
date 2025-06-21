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
  children,
  musicEnabled = false,
  musicUrl,
  autoplayMusic = false,
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