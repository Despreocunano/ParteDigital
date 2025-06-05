import React, { useState } from 'react';
import { MapPin, Clock, CalendarDays, Check } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { Modal } from '../../../../ui/Modal';
import { PublicRsvpForm } from '../../../../forms/PublicRsvpForm';

interface EventProps {
  title: string;
  date: string;
  time?: string;
  location: string;
  details?: string;
  className?: string;
}

function Event({ title, date, time, location, details, className = '' }: EventProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-[#B76E79]/10 ${className}`}>
      <div className="p-8 md:p-10">
        <h3 className="text-3xl font-serif mb-8 text-[#B76E79]">{title}</h3>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-[#B76E79]/10 flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-5 h-5 text-[#B76E79]" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium text-[#B76E79]">
                {new Date(date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {time && (
                <div className="flex items-center mt-2 text-[#B76E79]/80">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{time}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-[#B76E79]/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#B76E79]" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium text-[#B76E79]">{location}</p>
              {details && (
                <p className="mt-2 text-[#B76E79]/80 leading-relaxed">{details}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EventsProps {
  userId: string;
  ceremonyDate?: string;
  ceremonyTime?: string;
  ceremonyLocation?: string;
  ceremonyAddress?: string;
  partyDate?: string;
  partyTime?: string;
  partyLocation?: string;
  partyAddress?: string;
  showSongRecommendations?: boolean;
  className?: string;
}

export function Events({
  userId,
  ceremonyDate,
  ceremonyTime,
  ceremonyLocation,
  ceremonyAddress,
  partyDate,
  partyTime,
  partyLocation,
  partyAddress,
  showSongRecommendations = false,
  className = ''
}: EventsProps) {
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  if (!ceremonyLocation && !partyLocation) return null;

  return (
    <>
      <section className={`py-32 px-4 ${className}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#B76E79]">Eventos</h2>
            <div className="w-px h-12 bg-[#B76E79]/30 mx-auto mt-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {ceremonyLocation && ceremonyDate && (
              <Event
                title="Ceremonia"
                date={ceremonyDate}
                time={ceremonyTime}
                location={ceremonyLocation}
                details={ceremonyAddress}
              />
            )}

            {partyLocation && partyDate && (
              <Event
                title="Celebración"
                date={partyDate}
                time={partyTime}
                location={partyLocation}
                details={partyAddress}
              />
            )}
          </div>

          <div className="mt-12 text-center">
            <Button
              onClick={() => setShowRsvpModal(true)}
              className="bg-[#B76E79] hover:bg-[#A65D68] text-white px-8 py-3"
              leftIcon={<Check className="w-4 h-4" />}
            >
              Confirmar Asistencia
            </Button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={showRsvpModal}
        onClose={() => setShowRsvpModal(false)}
        title="Confirmar Asistencia"
      >
        <PublicRsvpForm
          userId={userId}
          showSongRecommendations={showSongRecommendations}
          onSuccess={() => setShowRsvpModal(false)}
        />
      </Modal>
    </>
  );
}