import React, { useState } from 'react';
import { BaseTemplate } from '../BaseTemplate';
import { Hero } from './components/Hero';
import { Events } from './components/Events';
import { Countdown } from './components/Countdown';
import { GallerySection } from './components/GallerySection';
import { PartyInfo } from './components/PartyInfo';
import { Social } from './components/Social';
import { Gifts } from './components/Gifts';
import { Footer } from './components/Footer';
import { WelcomeModal } from './components/WelcomeModal';
import type { TemplateProps } from '../types';

export function DeluxeTemplate({
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
    onMusicToggle?.(false);
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

      <main className="font-['Cormorant_Garamond'] bg-[#1C2127]">
        <div className="container mx-auto max-w-6xl shadow-2xl/30">
          <Hero
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            welcomeMessage={welcomeMessage}
            backgroundImage={coverImage || "https://images.pexels.com/photos/931796/pexels-photo-931796.jpeg"}
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

          <PartyInfo
            dresscode="Black Tie"
            musicInfo={musicEnabled ? "Ayúdanos a crear la playlist perfecta sugiriendo tus canciones favoritas" : undefined}
            tips="La elegancia será nuestra mejor compañía"
            className="bg-[#253238] border-y border-[#D4B572]/20"
            userId={userId}
          />

          <GallerySection
            images={galleryImages}
            className="bg-[#2F3E46]"
          />

          <Gifts
            bankInfo={bankInfo}
            className="bg-[#253238] border-y border-[#D4B572]/20"
          />

          <Social
            instagramHashtag={`${groomName}Y${brideName}2024`}
            className="bg-[#253238] border-y border-[#D4B572]/20"
          />

          <Footer
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            className="bg-[#2F3E46] border-t border-[#D4B572]/20"
          />
        </div>
      </main>
    </BaseTemplate>
  );
}