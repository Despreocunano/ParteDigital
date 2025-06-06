import React from 'react';
import { Instagram } from 'lucide-react';
import { Button } from '../../../../ui/Button';

interface SocialProps {
  hashtag?: string;
  instagramPosts?: Array<{
    id: string;
    imageUrl: string;
    caption?: string;
  }>;
  className?: string;
}

export function Social({ hashtag, instagramPosts = [], className = '' }: SocialProps) {
  const handleInstagramClick = () => {
    window.open(`https://www.instagram.com/explore/tags/${hashtag?.toLowerCase()}`, '_blank');
  };

  return (
    <section className={`py-24 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto text-center">
        <div className="w-16 h-16 bg-[#D4B572]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Instagram className="w-8 h-8 text-[#D4B572]" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-serif mb-8 text-[#D4B572]">Comparte tus Fotos</h2>
        
        <div className="max-w-xl mx-auto mb-12 space-y-6">
          <div className="inline-block bg-[#1C2127] border border-[#D4B572]/20 rounded-full px-6 py-3">
            <p className="text-2xl font-light text-[#D4B572]">
              #{hashtag}
            </p>
          </div>

          <div>
            <Button
              onClick={handleInstagramClick}
              className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white"
              leftIcon={<Instagram className="w-5 h-5" />}
            >
              Ver en Instagram
            </Button>
          </div>
        </div>
        
        {instagramPosts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {instagramPosts.map((post) => (
              <div 
                key={post.id}
                className="aspect-square overflow-hidden rounded-xl border border-[#D4B572]/10"
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption || 'Instagram post'}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}