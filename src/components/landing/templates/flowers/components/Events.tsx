import { useState, useEffect } from 'react';
import { MapPin, Clock, CalendarDays, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../ui/Button';
import { PublicRsvpForm } from '../../../../forms/PublicRsvpForm';
import { Divider } from './Divider';

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
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

  const handleOpenMaps = () => {
    if (placeId) {
      window.open(`https://www.google.com/maps/place/?q=place_id:${placeId}`, '_blank');
    } else if (address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
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

  return (
    <motion.div 
      className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-[#E8A87C]/30 ${className}`}
      variants={variants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-8 md:p-10">
        <h3 className="text-3xl font-serif mb-8 text-[#8B4513]">{title}</h3>
        <div className="space-y-6">
          <div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#E8A87C]/20 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-5 h-5 text-[#8B4513]" />
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium text-[#8B4513]">
                  {new Date(date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {time && (
                  <div className="flex items-center mt-2 text-[#8B4513]/80">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{time}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => setShowCalendarOptions(!showCalendarOptions)}
                leftIcon={<CalendarDays className="w-5 h-5" />}
                className="bg-[#8B4513] hover:bg-[#A0522D] text-white px-8 py-3 w-full flex items-center justify-center gap-2"
              >
                Agendar
              </Button>
              
              <AnimatePresence>
                {showCalendarOptions && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 bg-white border border-[#E8A87C]/20 rounded-lg shadow-lg p-2"
                  >
                    <motion.a
                      href={generateCalendarLink('google')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-left px-4 py-2 text-[#8B4513] hover:bg-[#E8A87C]/10 rounded-md"
                      whileHover={{ x: 5 }}
                    >
                      Google Calendar
                    </motion.a>
                    <motion.a
                      href={generateCalendarLink('apple')}
                      download="event.ics"
                      className="block w-full text-left px-4 py-2 text-[#8B4513] hover:bg-[#E8A87C]/10 rounded-md"
                      whileHover={{ x: 5 }}
                    >
                      Apple Calendar
                    </motion.a>
                    <motion.a
                      href={generateCalendarLink('outlook')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-left px-4 py-2 text-[#8B4513] hover:bg-[#E8A87C]/10 rounded-md"
                      whileHover={{ x: 5 }}
                    >
                      Outlook
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#E8A87C]/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#8B4513]" />
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium text-[#8B4513]">{location}</p>
                {address && (
                  <p className="mt-2 text-[#8B4513]/80 leading-relaxed">{address}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Button
                onClick={handleOpenMaps}
                className="bg-[#8B4513] hover:bg-[#A0522D] text-white px-8 py-3 w-full"
              >
                ¿Cómo llegar?
              </Button>
            </div>
          </div>

          <Button
            onClick={onRsvp}
            className="bg-[#8B4513] hover:bg-[#A0522D] text-white px-8 py-3 w-full"
          >
            Confirmar asistencia
          </Button>
        </div>
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
  className = ''
}: EventsProps) {
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowRsvpModal(false);
      }
    };

    if (showRsvpModal) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showRsvpModal]);

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
            <h2 className="text-3xl md:text-4xl font-serif text-[#8B4513]">¿Cuándo y Dónde?</h2>
            <Divider className="mt-8" />
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

      <AnimatePresence>
        {showRsvpModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDF8F5]/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRsvpModal(false)}
          >
            <motion.div 
              className="relative w-full max-w-xl px-8 py-12 text-center text-[#8B4513]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#E8A87C]/10 hover:bg-[#E8A87C]/20 transition-colors z-10"
              >
                <X className="w-5 h-5 text-[#8B4513]" />
              </button>

              {/* Floral corner decorations */}
              <div className="absolute top-0 left-0 w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
                  <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
                  <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 rotate-90">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
                  <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
                  <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 w-16 h-16 -rotate-90">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
                  <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
                  <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 rotate-180">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
                  <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
                  <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
                </svg>
              </div>

              <div className="space-y-8">
                <h2 className="text-3xl font-serif">Confirmar Asistencia</h2>
                <PublicRsvpForm
                  userId={userId}
                  onSuccess={() => setShowRsvpModal(false)}
                  theme={{
                    backgroundColor: '#FDF8F5',
                    textColor: '#8B4513',
                    borderColor: '#E8A87C',
                    inputBackground: '#FFFFFF',
                    placeholderColor: '#8B4513',
                    accentColor: '#A0522D',
                    successBackground: '#FDF8F5',
                    successText: '#8B4513',
                    errorBackground: 'rgba(220, 38, 38, 0.2)',
                    errorText: '#ef4444'
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}