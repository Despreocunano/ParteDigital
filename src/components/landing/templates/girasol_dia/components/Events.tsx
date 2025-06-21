import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../ui/Button';
import { PublicRsvpForm } from '../../../../forms/PublicRsvpForm';
import lineas from '../assets/lineas01.svg'
import { InfoModal } from '../../../shared/InfoModal';


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
  const handleOpenMaps = () => {
    if (placeId) {
      window.open(`https://www.google.com/maps/place/?q=place_id:${placeId}`, '_blank');
    } else if (address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
  };


  return (
    
    <motion.div 
      className={`relative group ${className}`}
      variants={variants}
    >
      
      <div className="relative rounded-xl bg-transparent max-w-md mx-auto">
        <div className="relative -top-8 flex justify-center w-full mb-4">
          <div
            className="relative py-3 px-12"
            style={{
              backgroundColor: '#9DB677',
              clipPath: 'polygon(0% 0%, 93% 0, 100% 50%, 93% 100%, 0% 100%, 7% 50%)'
            }}
          >
            <h3 className="text-4xl md:text-5xl font-fraunces text-white text-center">
              {title}
            </h3>
          </div>
        </div>

        <div className="p-8 md:p-10 pt-0 space-y-8">
          <div className="space-y-4 text-center">
            <h4 className="text-5xl font-abril text-[#998478] mb-2">Lugar</h4>
            <div className="flex flex-col items-center">
              <p className="text-lg font-opensans text-[#404040]">{location}</p>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <h4 className="text-5xl font-abril text-[#998478] mb-2">Día</h4>
            <div className="flex items-center justify-center gap-4">
              <p className="text-lg font-opensans text-[#404040]">
                {new Date(date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {time && (
                <span className="text-lg font-opensans text-[#404040]">•</span>
              )}
              {time && (
                <span className="text-lg font-opensans text-[#404040]">{time}</span>
              )}
            </div>
          </div>

          {address && (
          <div className="space-y-4 text-center">
            <h4 className="text-5xl font-abril text-[#998478] mb-2">Dirección</h4>
              <div className="flex flex-col items-center">
                <p className="text-lg font-opensans text-[#404040]">{address}</p>
              </div>
            <Button
              onClick={handleOpenMaps}
              className="bg-[#f9be5a] hover:bg-[#D0C293] text-[#404040] px-6 py-2 w-48 mx-auto rounded-full text-base font-sans shadow-sm"
            >
              ¿Cómo llegar?
            </Button>
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
  className = '',
  groomName = '',
  brideName = ''
}: EventsProps) {
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<'ceremony' | 'party' | null>(null);

  const generateCalendarLink = (type: 'google' | 'apple' | 'outlook') => {
    if (!selectedEvent) return '';

    const eventData = selectedEvent === 'ceremony' 
      ? {
          title: 'Ceremonia',
          date: ceremonyDate,
          time: ceremonyTime,
          location: ceremonyLocation,
          address: ceremonyAddress
        }
      : {
          title: 'Recepción',
          date: partyDate,
          time: partyTime,
          location: partyLocation,
          address: partyAddress
        };

    const eventTitle = encodeURIComponent(`Boda de ${groomName} & ${brideName}`);
    const eventLocation = encodeURIComponent(eventData.address || eventData.location || '');
    const startDate = new Date(eventData.date || '');
    const endDate = new Date(eventData.date || '');
    
    if (eventData.time) {
      const [hours, minutes] = eventData.time.split(':');
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowRsvpModal(false);
        setShowCalendarOptions(false);
      }
    };

    if (showRsvpModal || showCalendarOptions) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showRsvpModal, showCalendarOptions]);

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
                onRsvp={() => {
                  setSelectedEvent('ceremony');
                  setShowRsvpModal(true);
                }}
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
                onRsvp={() => {
                  setSelectedEvent('party');
                  setShowRsvpModal(true);
                }}
              />
            )}
          </div>

          <motion.div 
            className="mt-12 max-w-4xl mx-auto px-4"
            variants={item}
          >
            <div className="relative rounded-xl bg-transparent">
              <div className="p-8 md:p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => setShowRsvpModal(true)}
                    className="bg-[#f9be5a] hover:bg-[#D0C293] text-[#404040] px-6 py-2 w-full rounded-full font-sans shadow-sm"
                  >
                    Confirmar Asistencia
                  </Button>

                  <Button
                    onClick={() => {
                      setSelectedEvent(ceremonyLocation ? 'ceremony' : 'party');
                      setShowCalendarOptions(!showCalendarOptions);
                    }}
                    className="bg-[#f9be5a] hover:bg-[#D0C293] text-[#404040] px-6 py-2 w-full rounded-full font-sans shadow-sm"
                  >
                    Agendar Evento
                  </Button>
                  
                  <AnimatePresence>
                    {showCalendarOptions && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="col-span-1 md:col-span-2 mt-2 bg-[#f9be5a] border border-[#CFD6BA]/20 rounded-lg shadow-lg p-2 font-sans"
                      >
                        <motion.a
                          href={generateCalendarLink('google')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-2 text-[#404040] hover:bg-[#CFD6BA]/10 rounded-md"
                          whileHover={{ x: 5 }}
                        >
                          Google Calendar
                        </motion.a>
                        <motion.a
                          href={generateCalendarLink('apple')}
                          download="event.ics"
                          className="block w-full text-left px-4 py-2 text-[#404040] hover:bg-[#CFD6BA]/10 rounded-md"
                          whileHover={{ x: 5 }}
                        >
                          Apple Calendar
                        </motion.a>
                        <motion.a
                          href={generateCalendarLink('outlook')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-2 text-[#404040] hover:bg-[#CFD6BA]/10 rounded-md"
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

      <InfoModal
        isOpen={showRsvpModal}
        onClose={() => setShowRsvpModal(false)}
        title="Confirmar Asistencia"
        icon={UserPlus}
        iconColor="#CFD6BA"
        overlayColor="#012D27"
      >
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
      </InfoModal>
    </>
  );
}