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

export function CerezoTemplate({
  groomName,
  brideName,
  weddingDate,
  welcomeMessage,
  hashtag,
  ceremonyDate,
  ceremonyTime,
  ceremonyLocation,
  ceremonyAddress,
  ceremonyPlaceId,
  partyDate,
  partyTime,
  partyLocation,
  partyAddress,
  partyPlaceId,
  musicEnabled = false,
  musicUrl,
  onMusicToggle,
  coverImage,
  galleryImages = [],
  userId,
  bankInfo,
  dress_code,
  additional_info
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

  // Generate default hashtag if none provided
  const defaultHashtag = `${groomName.replace(/\s+/g, '')}Y${brideName.replace(/\s+/g, '')}2024`;

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

      <main className="font-['Playfair_Display'] bg-gradient-to-b from-[#FCE4EC] via-[#F8BBD9] to-[#FCE4EC] w-full">
        <div className="w-full">
          <Hero
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            welcomeMessage={welcomeMessage}
            backgroundImage={coverImage}
            className="bg-gradient-to-br from-[#2D1B69] to-[#E91E63]"
            showWelcomeModal={showWelcomeModal}
          />

          <Countdown 
            date={weddingDate}
            className="bg-gradient-to-r from-[#FCE4EC] to-[#F8BBD9]"
          />

          <Events
            userId={userId}
            ceremonyDate={ceremonyDate}
            ceremonyTime={ceremonyTime}
            ceremonyLocation={ceremonyLocation}
            ceremonyAddress={ceremonyAddress}
            ceremonyPlaceId={ceremonyPlaceId}
            partyDate={partyDate}
            partyTime={partyTime}
            partyLocation={partyLocation}
            partyAddress={partyAddress}
            partyPlaceId={partyPlaceId}
            className="bg-gradient-to-l from-[#F8BBD9] to-[#FCE4EC]"
          />

          <PartyInfo
            dresscode={dress_code || ''}
            musicInfo={musicEnabled ? "¿Cuál es la canción que no debe faltar en la playlist de la fiesta?" : undefined}
            tips={additional_info || ''}
            className="bg-gradient-to-r from-[#FCE4EC] to-[#F8BBD9] border-y border-[#F8BBD9]/30"
            userId={userId}
          />

          <GallerySection
            images={galleryImages}
            className="bg-gradient-to-l from-[#F8BBD9] to-[#FCE4EC]"
          />

          <Gifts
            bankInfo={bankInfo}
            className="bg-gradient-to-r from-[#FCE4EC] to-[#F8BBD9] border-y border-[#F8BBD9]/30"
          />

          <Social
            hashtag={hashtag || defaultHashtag}
            className="bg-gradient-to-l from-[#F8BBD9] to-[#FCE4EC] border-y border-[#F8BBD9]/30"
          />

          <Footer
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            className="bg-gradient-to-r from-[#2D1B69] to-[#E91E63] border-t border-[#F8BBD9]/30"
          />
        </div>
      </main>
    </BaseTemplate>
  );
}