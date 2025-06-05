import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Alert } from '../ui/Alert';
import { useWedding } from '../../hooks/useWedding';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { profileImage } = useWedding();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNav />
      <main className="md:pl-64 min-h-screen">
        <div className="py-6">
          {!profileImage && (
            <div className="mx-auto px-4 sm:px-6 md:px-8 mb-6">
              <Alert 
                message="No has subido una foto de perfil. Esta imagen será utilizada como logo en la firma de los correos enviados a tus invitados."
                action={{
                  text: "Subir foto",
                  to: "/settings"
                }}
              />
            </div>
          )}
          <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
        </div>
      </main>
    </div>
  );
}