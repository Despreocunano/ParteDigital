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

export function FlowersTemplate({
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

      <div className="font-['Playfair_Display'] bg-[#FDF8F5]">
        <div className="container mx-auto max-w-7xl">
          <Hero
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            welcomeMessage={welcomeMessage}
            backgroundImage={coverImage || "https://images.pexels.com/photos/931158/pexels-photo-931158.jpeg"}
          />

          <Countdown 
            date={weddingDate}
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
          />

          <PartyInfo
            dresscode="Formal"
            musicInfo="Música en vivo y DJ"
            tips="La celebración será al aire libre"
          />

          <GallerySection
            images={galleryImages}
          />

          <Gifts
            bankInfo={bankInfo}
          />

          <Social
            instagramHashtag={`${groomName}Y${brideName}2024`}
          />

          <Footer
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
          />
        </div>
      </div>
    </BaseTemplate>
  );
}