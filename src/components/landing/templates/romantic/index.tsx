import React, { useState } from 'react';
import { BaseTemplate } from '../BaseTemplate';
import { Hero } from './components/Hero';
import { Events } from './components/Events';
import { Countdown } from './components/Countdown';
import { GallerySection } from './components/GallerySection';
import { Footer } from './components/Footer';
import { WelcomeModal } from './components/WelcomeModal';
import { Gifts } from './components/Gifts';
import type { TemplateProps } from '../types';

export function RomanticTemplate({
  groomName,
  brideName,
  weddingDate,
  welcomeMessage,
  ceremonyDate,
  ceremonyTime,
  ceremonyLocation,
  ceremonyAddress,
  partyDate,
  partyTime,
  partyLocation,
  partyAddress,
  musicEnabled = false,
  musicUrl,
  onMusicToggle,
  coverImage,
  galleryImages = [],
  userId,
  bankInfo
}: TemplateProps) {
  const [showWelcomeModal, setShowWelcomeModal] = useState(musicEnabled);
  const [autoplayMusic, setAutoplayMusic] = useState(false);

  const handleEnterWithMusic = () => {
    setAutoplayMusic(true);
    onMusicToggle?.(true);
    setShowWelcomeModal(false);
  };

  const handleEnterWithoutMusic = () => {
    setAutoplayMusic(false);
    onMusicToggle?.(true);
    setShowWelcomeModal(false);
  };

  return (
    <BaseTemplate
      groomName={groomName}
      brideName={brideName}
      weddingDate={weddingDate}
      musicEnabled={musicEnabled}
      musicUrl={musicUrl}
      autoplayMusic={autoplayMusic}
      onMusicToggle={onMusicToggle}
    >
      {showWelcomeModal && (
        <WelcomeModal
          groomName={groomName}
          brideName={brideName}
          onEnterWithMusic={handleEnterWithMusic}
          onEnterWithoutMusic={handleEnterWithoutMusic}
        />
      )}

      <div className="font-['Cormorant_Garamond'] bg-[#2F3E46]">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <Hero
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            welcomeMessage={welcomeMessage}
            backgroundImage={coverImage || "https://images.pexels.com/photos/1589820/pexels-photo-1589820.jpeg"}
            className="bg-[#2F3E46]"
          />

          <Countdown 
            date={weddingDate}
            className="bg-[#253238]"
          />

          <Events
            userId={userId}
            ceremonyDate={ceremonyDate}
            ceremonyTime={ceremonyTime}
            ceremonyLocation={ceremonyLocation}
            ceremonyAddress={ceremonyAddress}
            partyDate={partyDate}
            partyTime={partyTime}
            partyLocation={partyLocation}
            partyAddress={partyAddress}
            showSongRecommendations={musicEnabled}
            className="bg-[#2F3E46]"
          />

          <GallerySection
            images={galleryImages}
            className="bg-[#2F3E46]"
          />

          <Gifts
            bankInfo={bankInfo}
            className="bg-[#253238] border-y border-[#D4B572]/20"
          />

          <Footer
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            className="bg-[#2F3E46] border-t border-[#D4B572]/20"
          />
        </div>
      </div>
    </BaseTemplate>
  );
}