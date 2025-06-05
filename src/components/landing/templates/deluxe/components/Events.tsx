import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../../ui/Button';
import { Modal } from '../../../../ui/Modal';
import { PublicRsvpForm } from '../../../../forms/PublicRsvpForm';

interface EventProps {
  title: string;
  date: string;
  time?: string;
  location: string;
  address?: string;
  placeId?: string;
  className?: string;
  variants?: any;
  onRsvp: () => void;
}

function Event({ title, date, time, location, address, placeId, className = '', variants, onRsvp }: EventProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  
  useEffect(() => {
    console.log('Event component mounted');
    setIsMounted(true);
  }, []);

  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleOpenMaps = () => {
    if (placeId) {
      window.open(`https://www.google.com/maps/place/?q=place_id:${placeId}`, '_blank');
    } else if (address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
  };

  // Calculate end time (2 hours after start time)
  const getEndTime = () => {
    if (!time) return undefined;
    const [hours, minutes] = time.split(':');
    const endHours = (parseInt(hours) + 2).toString().padStart(2, '0');
    return `${endHours}:${minutes}`;
  };

  const generateCalendarLink = (type: 'google' | 'apple' | 'outlook') => {
    const eventTitle = encodeURIComponent(`${title} - Boda`);
    const eventLocation = encodeURIComponent(address || location);
    const startDate = new Date(date);
    const endDate = new Date(date);
    
    if (time) {
      const [hours, minutes] = time.split(':');
      startDate.setHours(parseInt(hours), parseInt(minutes));
      endDate.setHours(parseInt(hours) + 2, parseInt(minutes));
    }

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    switch (type) {
      case 'google':
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatDate(startDate)}/${formatDate(endDate)}&location=${eventLocation}`;
      case 'apple':
        return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${document.URL}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${eventTitle}
DESCRIPTION:${eventTitle}
LOCATION:${eventLocation}
END:VEVENT
END:VCALENDAR`;
      case 'outlook':
        return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${eventTitle}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&location=${eventLocation}`;
      default:
        return '';
    }
  };

  console.log('Rendering Event component:', { isMounted, title, date, time });

  return (
    <motion.div 
      className={`bg-[#1C2127] rounded-2xl shadow-lg overflow-hidden border border-[#D4B572]/20 ${className}`}
      variants={variants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-8 md:p-10 flex flex-col items-center text-center">
        <h3 className="text-4xl font-serif text-[#D4B572] mb-12">{title}</h3>

        {/* Date section */}
        <div className="mb-12 w-full">
          <h4 className="text-2xl font-serif text-[#D4B572] mb-4">Día</h4>
          <p className="text-lg text-[#D4B572]/80 mb-4">{formattedDate}</p>
          {time && (
            <p className="text-lg text-[#D4B572]/80 flex items-center justify-center mb-6">
              <Clock className="w-5 h-5 mr-2" />
              {time}
            </p>
          )}
          <div className="relative w-full">
            <Button
              onClick={() => setShowCalendarOptions(!showCalendarOptions)}
              className="bg-[#D4B572] hover:bg-[#C4A562] text-[#1C2127] px-8 py-3 w-full flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Agendar
            </Button>
            
            {showCalendarOptions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C2127] border border-[#D4B572]/20 rounded-lg shadow-lg p-2 z-10">
                <a
                  href={generateCalendarLink('google')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-[#D4B572] hover:bg-[#D4B572]/10 rounded-md"
                >
                  Google Calendar
                </a>
                <a
                  href={generateCalendarLink('apple')}
                  download="event.ics"
                  className="block w-full text-left px-4 py-2 text-[#D4B572] hover:bg-[#D4B572]/10 rounded-md"
                >
                  Apple Calendar
                </a>
                <a
                  href={generateCalendarLink('outlook')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-[#D4B572] hover:bg-[#D4B572]/10 rounded-md"
                >
                  Outlook
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Location section */}
        <div className="mb-12 w-full">
          <h4 className="text-2xl font-serif text-[#D4B572] mb-4">Lugar</h4>
          <p className="text-lg text-[#D4B572]/80 mb-6">{location}</p>
          <Button
            onClick={onRsvp}
            className="bg-[#D4B572] hover:bg-[#C4A562] text-[#1C2127] px-8 py-3 w-full"
          >
            Confirmar asistencia
          </Button>
        </div>

        {/* Address section */}
        {address && (
          <div className="w-full">
            <h4 className="text-2xl font-serif text-[#D4B572] mb-4">Dirección</h4>
            <p className="text-lg text-[#D4B572]/80 mb-6">{address}</p>
            <Button
              onClick={handleOpenMaps}
              className="bg-[#D4B572] hover:bg-[#C4A562] text-[#1C2127] px-8 py-3 w-full"
            >
              ¿Cómo llegar?
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface EventsProps {
  userId: string;
  ceremonyDate?: string;
  ceremonyTime?: string;
  ceremonyLocation?: string;
  ceremonyAddress?: string;
  ceremonyPlaceId?: string;
  partyDate?: string;
  partyTime?: string;
  partyLocation?: string;
  partyAddress?: string;
  partyPlaceId?: string;
  showSongRecommendations?: boolean;
  className?: string;
}

export function Events({
  userId,
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
  showSongRecommendations = false,
  className = ''
}: EventsProps) {
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (!ceremonyLocation && !partyLocation) return null;

  return (
    <>
      <section className={`py-32 px-4 ${className}`}>
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <motion.div 
            className="text-center mb-16"
            variants={item}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[#D4B572]">¿Cuándo y Dónde?</h2>
            <div className="w-px h-12 bg-[#D4B572]/30 mx-auto mt-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {ceremonyLocation && ceremonyDate && (
              <Event
                title="Ceremonia"
                date={ceremonyDate}
                time={ceremonyTime}
                location={ceremonyLocation}
                address={ceremonyAddress}
                placeId={ceremonyPlaceId}
                variants={item}
                onRsvp={() => setShowRsvpModal(true)}
              />
            )}

            {partyLocation && partyDate && (
              <Event
                title="Celebración"
                date={partyDate}
                time={partyTime}
                location={partyLocation}
                address={partyAddress}
                placeId={partyPlaceId}
                variants={item}
                onRsvp={() => setShowRsvpModal(true)}
              />
            )}
          </div>
        </motion.div>
      </section>

      <Modal
        isOpen={showRsvpModal}
        onClose={() => setShowRsvpModal(false)}
        title="Confirmar Asistencia"
      >
        <PublicRsvpForm
          userId={userId}
          showSongRecommendations={false}
          onSuccess={() => setShowRsvpModal(false)}
        />
      </Modal>
    </>
  );
}