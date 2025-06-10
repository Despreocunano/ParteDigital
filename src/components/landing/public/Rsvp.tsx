import { PublicRsvpForm } from '../../forms/PublicRsvpForm';

interface RsvpProps {
  userId: string;
  showSongRecommendations?: boolean;
}

export function Rsvp({ userId, showSongRecommendations = false }: RsvpProps) {
  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Confirma tu Asistencia</h2>
          <div className="w-px h-12 bg-rose-200 mx-auto mt-8"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
          <PublicRsvpForm 
            userId={userId}
            showSongRecommendations={showSongRecommendations}
          />
        </div>
      </div>
    </section>
  );
}