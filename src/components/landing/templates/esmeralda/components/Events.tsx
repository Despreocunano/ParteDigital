import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../ui/Button';
import { PublicRsvpForm } from '../../../../forms/PublicRsvpForm';
import lineas from '../assets/lineas01.svg'


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
        return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nURL:${document.URL}\nDTSTART:${formatDate(startDate)}\nDTEND:${formatDate(endDate)}\nSUMMARY:${eventTitle}\nDESCRIPTION:${eventTitle}\nLOCATION:${eventLocation}\nEND:VEVENT\nEND:VCALENDAR`;
      case 'outlook':
        return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${eventTitle}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&location=${eventLocation}`;
      default:
        return '';
    }
  };

  return (
    <motion.div 
      className={`relative group ${className}`}
      variants={variants}
    >
      <div className="relative rounded-xl bg-transparent max-w-md mx-auto">
        <div className="relative -top-8 flex justify-center w-full">
          <div className="absolute bg-transparent w-[150px] h-[40px] transform -skew-y-3"></div>
          <div className="absolute bg-transparent w-[150px] h-[40px] transform skew-y-3"></div>
          <h3 className="relative z-10 text-5xl md:text-6xl font-parisienne text-white mb-6 text-center">
            {title}
          </h3>
        </div>

        <div className="p-8 md:p-10 pt-0 space-y-8">
          <div className="space-y-4 text-center">
            <h4 className="text-4xl font-parisienne text-white mb-2">Día</h4>
            <div className="flex items-center justify-center gap-4">
              <p className="text-lg font-lora text-[#cfd6ba]">
                {new Date(date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {time && (
                <span className="font-lora text-[#cfd6ba]">•</span>
              )}
              {time && (
                <span className="text-lg font-lora text-[#cfd6ba]">{time}</span>
              )}
            </div>
            
            <Button
              onClick={() => setShowCalendarOptions(!showCalendarOptions)}
              className="bg-[#E5D7A9] hover:bg-[#D0C293] text-[#0A3831] px-6 py-2 w-48 mx-auto rounded-full text-base font-medium shadow-sm"
            >
              Agendar Evento
            </Button>
            
            <AnimatePresence>
              {showCalendarOptions && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-transparent p-4"
                >
                  <motion.a
                    href={generateCalendarLink('google')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-48 mx-auto text-center px-4 py-2 text-white hover:bg-white/10 rounded-xl transition-colors font-sans"
                    whileHover={{ x: 5 }}
                  >
                    Google Calendar
                  </motion.a>
                  <motion.a
                    href={generateCalendarLink('apple')}
                    download="event.ics"
                    className="block w-48 mx-auto text-center px-4 py-2 text-white hover:bg-white/10 rounded-xl transition-colors font-sans"
                    whileHover={{ x: 5 }}
                  >
                    Apple Calendar
                  </motion.a>
                  <motion.a
                    href={generateCalendarLink('outlook')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-48 mx-auto text-center px-4 py-2 text-white hover:bg-white/10 rounded-xl transition-colors font-sans"
                    whileHover={{ x: 5 }}
                  >
                    Outlook
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4 text-center">
            <h4 className="text-4xl font-parisienne text-white mb-2">Lugar</h4>
            <div className="flex flex-col items-center">
              <p className="text-lg font-lora text-[#cfd6ba]">{location}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={onRsvp}
              className="bg-[#E5D7A9] hover:bg-[#D0C293] text-[#0A3831] px-6 py-2 w-48 rounded-full text-base font-medium shadow-sm"
            >
              Confirmar Asistencia
            </Button>
          </div>

          <div className="space-y-4 text-center">
            <h4 className="text-4xl font-parisienne text-white mb-2">Dirección</h4>
            {address && (
              <div className="flex flex-col items-center">
                <p className="text-lg font-lora text-[#cfd6ba]">{address}</p>
              </div>
            )}
            <Button
              onClick={handleOpenMaps}
              className="bg-[#E5D7A9] hover:bg-[#D0C293] text-[#0A3831] px-6 py-2 w-48 mx-auto rounded-full text-base font-medium shadow-sm"
            >
              ¿Cómo llegar?
            </Button>
          </div>
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
    hidden: { y: 30, opacity: 0 },
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
      <section className={`pb-32 px-4 w-full ${className}`}>
        <motion.div 
          className="w-full max-w-none mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <img src={lineas} alt="Líneas decorativas" className="w-full h-auto mb-20" />
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 max-w-4xl mx-auto px-4">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012D27]">
            <div className="relative w-full max-w-2xl px-12 py-12 text-center text-[#CFD6BA]">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-24 h-24">
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 scale-x-[-1]">
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-24 scale-y-[-1]">
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 scale-[-1]">
              </div>
              <button
                type="button"
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-12 right-12 w-8 h-8 flex items-center justify-center rounded-full bg-[#CFD6BA]/20 hover:bg-[#CFD6BA]/40 transition-colors z-20"
              >
                <X className="w-5 h-5 text-[#CFD6BA]" />
              </button>
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-sm font-lora tracking-[0.2em] uppercase text-[#CFD6BA]">
                    Confirmar Asistencia
                  </p>
                  <div className="space-y-4">
                    <h1 className="text-6xl font-parisienne text-[#CFD6BA]">
                      Nos encantaría tenerte
                    </h1>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#CFD6BA]/30"></div>
                  <div className="w-2 h-2 rounded-full bg-[#CFD6BA]/30"></div>
                  <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#CFD6BA]/30"></div>
                </div>

                <div className="space-y-6">
                  <div>
                    <PublicRsvpForm
                      userId={userId}
                      onSuccess={() => setShowRsvpModal(false)}
                      theme={{
                        backgroundColor: '#012D27',
                        textColor: '#CFD6BA',
                        borderColor: '#CFD6BA',
                        inputBackground: '#012D27',
                        placeholderColor: '#CFD6BA',
                        accentColor: '#CFD6BA',
                        successBackground: '#012D27',
                        successText: '#CFD6BA',
                        errorBackground: 'rgba(220, 38, 38, 0.1)',
                        errorText: '#ef4444'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}