import { MapPin, Clock, CalendarDays } from 'lucide-react';

interface EventProps {
  title: string;
  date: string;
  time?: string;
  location: string;
  details?: string;
  className?: string;
}

function Event({ title, date, time, location, details, className }: EventProps) {
  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden border border-gray-100 ${className || ''}`}>
      <div className="p-8 md:p-10">
        <h3 className="text-3xl font-serif mb-8 text-gray-900">{title}</h3>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-5 h-5 text-rose-600" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium text-gray-900">
                {new Date(date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {time && (
                <div className="flex items-center mt-2 text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{time}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-rose-600" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium text-gray-900">{location}</p>
              {details && (
                <p className="mt-2 text-gray-600 leading-relaxed">{details}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EventsProps {
  ceremonyDate?: string;
  ceremonyTime?: string;
  ceremonyLocation?: string;
  ceremonyDetails?: string;
  partyDate?: string;
  partyTime?: string;
  partyLocation?: string;
  partyDetails?: string;
}

export function Events({
  ceremonyDate,
  ceremonyTime,
  ceremonyLocation,
  ceremonyDetails,
  partyDate,
  partyTime,
  partyLocation,
  partyDetails
}: EventsProps) {
  if (!ceremonyLocation && !partyLocation) return null;

  return (
    <section className="py-32 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Eventos</h2>
          <div className="w-px h-12 bg-rose-200 mx-auto mt-8"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {ceremonyLocation && ceremonyDate && (
            <Event
              title="Ceremonia"
              date={ceremonyDate}
              time={ceremonyTime}
              location={ceremonyLocation}
              details={ceremonyDetails}
            />
          )}

          {partyLocation && partyDate && (
            <Event
              title="Celebración"
              date={partyDate}
              time={partyTime}
              location={partyLocation}
              details={partyDetails}
            />
          )}
        </div>
      </div>
    </section>
  );
}