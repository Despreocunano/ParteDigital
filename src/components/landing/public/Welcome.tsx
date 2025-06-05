import React from 'react';

interface WelcomeProps {
  message: string;
}

export function Welcome({ message }: WelcomeProps) {
  if (!message) return null;

  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-px h-12 bg-rose-200 mx-auto mb-12"></div>
        <p className="text-2xl md:text-3xl text-gray-700 font-light leading-relaxed">
          {message}
        </p>
      </div>
    </section>
  );
}