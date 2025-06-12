import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Alert } from '../ui/Alert';
import { useWedding } from '../../hooks/useWedding';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { profileImage } = useWedding();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <MobileNav />
      <main className="md:pl-64 min-h-screen relative">
        <div className="py-6">
          <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
        </div>
      </main>
    </div>
  );
}