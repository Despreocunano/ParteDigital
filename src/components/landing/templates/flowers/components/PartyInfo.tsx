import React from 'react';
import { Music2, Shirt, Lightbulb } from 'lucide-react';

interface PartyInfoProps {
  dresscode?: string;
  musicInfo?: string;
  tips?: string;
  className?: string;
}

export function PartyInfo({
  dresscode,
  musicInfo,
  tips,
  className = ''
}: PartyInfoProps) {
  return (
    <section className={`py-24 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-[#B76E79]">
          Información de la Fiesta
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {dresscode && (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-[#B76E79]/10">
              <div className="w-16 h-16 bg-[#B76E79]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shirt className="w-8 h-8 text-[#B76E79]" />
              </div>
              <h3 className="text-xl font-serif mb-4 text-[#B76E79]">Código de Vestimenta</h3>
              <p className="text-[#B76E79]/80">{dresscode}</p>
            </div>
          )}
          
          {musicInfo && (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-[#B76E79]/10">
              <div className="w-16 h-16 bg-[#B76E79]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music2 className="w-8 h-8 text-[#B76E79]" />
              </div>
              <h3 className="text-xl font-serif mb-4 text-[#B76E79]">Música</h3>
              <p className="text-[#B76E79]/80">{musicInfo}</p>
            </div>
          )}
          
          {tips && (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-[#B76E79]/10">
              <div className="w-16 h-16 bg-[#B76E79]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-[#B76E79]" />
              </div>
              <h3 className="text-xl font-serif mb-4 text-[#B76E79]">Tips y Notas</h3>
              <p className="text-[#B76E79]/80">{tips}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}