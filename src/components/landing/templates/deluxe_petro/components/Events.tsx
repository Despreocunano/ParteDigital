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
}

function Event({ title, date, time, location, address, placeId, className = '', variants }: EventProps) {
  const handleOpenMaps = () => {
    if (placeId) {
      window.open(`https://www.google.com/maps/place/?q=place_id:${placeId}`, '_blank');
    } else if (address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
  };

  return (
    <motion.div 
      className={`bg-[#1C2127] rounded-2xl shadow-lg overflow-hidden border border-[#D4B572]/20 ${className}`}
      variants={variants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-8 md:p-10">
        <div className="flex items-center mb-6">
          <h3 className="text-3xl font-serif text-[#D4B572]">{title}</h3>
        </div>
        
        <div className="space-y-8">
          <div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#D4B572]/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#D4B572]" />
              </div>
              <div className="ml-4">
                <h4 className="text-2xl font-medium text-[#D4B572]/60 mb-1">Lugar</h4>
                <p className="text-lg font-medium text-[#D4B572] font-sans">{location}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#D4B572]/20 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-5 h-5 text-[#D4B572]" />
              </div>
              <div className="ml-4">
                <h4 className="text-2xl font-medium text-[#D4B572]/60 mb-1">Fecha</h4>
                <p className="text-lg font-medium text-[#D4B572] font-sans">
                  {new Date(date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {time && (
                    <span className="ml-2 text-[#D4B572]/80">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {time}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {address && (
            <div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#D4B572]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#D4B572]" />
                </div>
                <div className="ml-4">
                  <h4 className="text-2xl font-medium text-[#D4B572]/60">Dirección</h4>
                  <p className="text-lg font-medium text-[#D4B572] font-sans">{address}</p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleOpenMaps}
                  className="bg-[#D4B572] hover:bg-[#C4A562] text-[#1C2127] px-8 py-3 w-full font-sans"
                >
                  ¿Cómo llegar?
                </Button>
              </div>
            </div>
          )}
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
  groomName?: string;
  brideName?: string;
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
  className = '',
  groomName = '',
  brideName = ''
}: EventsProps) {
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

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

  const generateCalendarLink = (type: 'google' | 'apple' | 'outlook') => {
    const eventTitle = encodeURIComponent(`Boda de ${groomName} & ${brideName}`);
    const eventLocation = encodeURIComponent(ceremonyAddress || ceremonyLocation || '');
    const startDate = new Date(ceremonyDate || '');
    const endDate = new Date(ceremonyDate || '');
    
    if (ceremonyTime) {
      const [hours, minutes] = ceremonyTime.split(':');
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
            <h2 className="text-3xl md:text-4xl font-serif text-[#D4B572]">¿Cuándo y Dónde?</h2>
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
              />
            )}

            {partyLocation && partyDate && (
              <Event
                title="Recepción"
                date={partyDate}
                time={partyTime}
                location={partyLocation}
                address={partyAddress}
                placeId={partyPlaceId}
                variants={item}
              />
            )}
          </div>

          <motion.div 
            className="mt-8"
            variants={item}
          >
            <div className="bg-[#1C2127] rounded-2xl shadow-lg overflow-hidden border border-[#D4B572]/20">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => setShowRsvpModal(true)}
                    className="bg-[#D4B572] hover:bg-[#C4A562] text-[#1C2127] px-8 py-3 w-full font-sans"
                  >
                    Confirmar asistencia
                  </Button>

                  <Button
                    onClick={() => setShowCalendarOptions(!showCalendarOptions)}
                    leftIcon={<CalendarDays className="w-5 h-5" />}
                    className="bg-[#D4B572] hover:bg-[#C4A562] text-[#1C2127] px-8 py-3 w-full flex items-center justify-center gap-2 font-sans"
                  >
                    Agendar
                  </Button>
                  
                  <AnimatePresence>
                    {showCalendarOptions && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="col-span-1 md:col-span-2 mt-2 bg-[#1C2127] border border-[#D4B572]/20 rounded-lg shadow-lg p-2"
                      >
                        <motion.a
                          href={generateCalendarLink('google')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-2 text-[#D4B572] hover:bg-[#D4B572]/10 rounded-md"
                          whileHover={{ x: 5 }}
                        >
                          Google Calendar
                        </motion.a>
                        <motion.a
                          href={generateCalendarLink('apple')}
                          download="event.ics"
                          className="block w-full text-left px-4 py-2 text-[#D4B572] hover:bg-[#D4B572]/10 rounded-md"
                          whileHover={{ x: 5 }}
                        >
                          Apple Calendar
                        </motion.a>
                        <motion.a
                          href={generateCalendarLink('outlook')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-2 text-[#D4B572] hover:bg-[#D4B572]/10 rounded-md"
                          whileHover={{ x: 5 }}
                        >
                          Outlook
                        </motion.a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <AnimatePresence>
        {showRsvpModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C2127]/95 backdrop-blur-sm px-4"
          >
            <div 
              className="relative w-full max-w-2xl px-8 py-12 text-center bg-white rounded-lg shadow-xl"
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#D4B572]/30" />
              <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-[#D4B572]/30" />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-[#D4B572]/30" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-[#D4B572]/30" />

              <button
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="space-y-8">
                <div className="relative -mt-[100px] mb-8">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                    <CalendarDays className="w-12 h-12 text-[#D4B572]" />
                  </div>
                </div>
                <h2 className="text-2xl font-serif text-gray-900">Confirmar Asistencia</h2>
                <PublicRsvpForm
                  userId={userId}
                  onSuccess={() => setShowRsvpModal(false)}
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}