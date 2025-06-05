import React from 'react';
import { Music as MusicIcon } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  artist: string;
}

interface MusicProps {
  tracks: Track[];
}

export function Music({ tracks }: MusicProps) {
  if (!tracks?.length) return null;

  return (
    <section className="py-32 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Música</h2>
          <div className="w-px h-12 bg-rose-200 mx-auto mt-8"></div>
        </div>

        <div className="grid gap-4">
          {tracks.map((track) => (
            <div key={track.id} className="bg-white rounded-xl shadow-md p-6 flex items-center border border-gray-100">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mr-6">
                <MusicIcon className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">{track.name}</p>
                <p className="text-gray-600">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}