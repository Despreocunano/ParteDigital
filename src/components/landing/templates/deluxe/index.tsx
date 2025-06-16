import { useState } from 'react';
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
import { KidsAndPets } from './components/KidsAndPets';
import type { TemplateProps } from '../types';
import { InfiniteGallery } from '../../shared/InfiniteGallery';

export function DeluxeTemplate({
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
  additional_info,
  accepts_kids,
  accepts_pets,
  couple_code,
  store
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

      <main className="font-['Cormorant_Garamond'] bg-[#1C2127]">
        <div className="container mx-auto max-w-7xl">
          <Hero
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            welcomeMessage={welcomeMessage}
            backgroundImage={coverImage}
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
            ceremonyPlaceId={ceremonyPlaceId}
            partyDate={partyDate}
            partyTime={partyTime}
            partyLocation={partyLocation}
            partyAddress={partyAddress}
            partyPlaceId={partyPlaceId}
            showSongRecommendations={musicEnabled}
            className="bg-[#2F3E46]"
            groomName={groomName}
            brideName={brideName}
          />

          <KidsAndPets
            acceptsKids={accepts_kids}
            acceptsPets={accepts_pets}
          />

          <PartyInfo
            dresscode={dress_code || 'Formal'}
            musicInfo="¿Cuál es la canción que no debe faltar en la playlist de la fiesta?"
            tips={additional_info || 'La celebración será al aire libre'}
            className="bg-[#253238] border-y border-[#D4B572]/20"
            userId={userId}
          />

          <GallerySection
            images={galleryImages}
            className="bg-[#2F3E46]"
          />

          <Gifts
            bankInfo={bankInfo}
            couple_code={couple_code}
            store={store}
            className="bg-[#253238] border-y border-[#D4B572]/20"
          />

          <Social
            hashtag={hashtag || defaultHashtag}
            className="bg-[#253238] border-y border-[#D4B572]/20"
          />

          <InfiniteGallery
            images={galleryImages}
            frameColor="#D4B572"
            className="bg-[#253238]"
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