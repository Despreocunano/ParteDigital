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
      className={`bg-[#47261F] rounded-2xl shadow-lg overflow-hidden border border-[#DF9434]/20 ${className}`}
      variants={variants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-8 md:p-10">
        <div className="flex items-center mb-6">
          <h3 className="text-3xl font-serif text-[#DF9434]">{title}</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#DF9434]/20 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-5 h-5 text-[#DF9434]" />
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium text-[#DF9434]">
                  {new Date(date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {time && (
                  <div className="flex items-center mt-2 text-[#DF9434]/80">
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
                className="bg-[#DF9434] hover:bg-[#C4A562] text-[#47261F] px-8 py-3 w-full flex items-center justify-center gap-2"
              >
                Agendar
              </Button>
              
              <AnimatePresence>
                {showCalendarOptions && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 bg-[#47261F] border border-[#DF9434]/20 rounded-lg shadow-lg p-2"
                  >
                    <motion.a
                      href={generateCalendarLink('google')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-left px-4 py-2 text-[#DF9434] hover:bg-[#DF9434]/10 rounded-md"
                      whileHover={{ x: 5 }}
                    >
                      Google Calendar
                    </motion.a>
                    <motion.a
                      href={generateCalendarLink('apple')}
                      download="event.ics"
                      className="block w-full text-left px-4 py-2 text-[#DF9434] hover:bg-[#DF9434]/10 rounded-md"
                      whileHover={{ x: 5 }}
                    >
                      Apple Calendar
                    </motion.a>
                    <motion.a
                      href={generateCalendarLink('outlook')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-left px-4 py-2 text-[#DF9434] hover:bg-[#DF9434]/10 rounded-md"
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
              <div className="w-10 h-10 rounded-full bg-[#DF9434]/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#DF9434]" />
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium text-[#DF9434]">{location}</p>
                {address && (
                  <p className="mt-2 text-[#DF9434]/80 leading-relaxed">{address}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Button
                onClick={handleOpenMaps}
                className="bg-[#DF9434] hover:bg-[#C4A562] text-[#47261F] px-8 py-3 w-full"
              >
                ¿Cómo llegar?
              </Button>
            </div>
          </div>

          <Button
            onClick={onRsvp}
            className="bg-[#DF9434] hover:bg-[#C4A562] text-[#47261F] px-8 py-3 w-full"
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
            <h2 className="text-3xl md:text-4xl font-serif text-[#DF9434]">¿Cuándo y Dónde?</h2>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#47261F]/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRsvpModal(false)}
          >
            <motion.div 
              className="relative w-full max-w-xl px-8 py-12 text-center text-[#DF9434]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#DF9434]/10 hover:bg-[#DF9434]/20 transition-colors z-10"
              >
                <X className="w-5 h-5 text-[#DF9434]" />
              </button>

              <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#DF9434]/30"></div>
              <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-[#DF9434]/30"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-[#DF9434]/30"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-[#DF9434]/30"></div>

              <div className="space-y-8">
                <h2 className="text-3xl font-serif">Confirmar Asistencia</h2>
                <PublicRsvpForm
                  userId={userId}
                  onSuccess={() => setShowRsvpModal(false)}
                  theme={{
                    backgroundColor: '#47261F',
                    textColor: '#DF9434',
                    borderColor: '#DF9434',
                    inputBackground: '#47261F',
                    placeholderColor: '#DF9434',
                    accentColor: '#C4A562',
                    successBackground: '#47261F',
                    successText: '#DF9434',
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