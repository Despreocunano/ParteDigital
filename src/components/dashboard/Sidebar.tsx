import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, UserPlus, ListChecks, Grid, Settings, LogOut, Globe, Music, Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useWedding } from '../../hooks/useWedding';

export function Sidebar() {
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const { groomName, brideName, profileImage } = useWedding();

  const navigation = [
    { name: 'Panel', href: '/', icon: Heart },
    { name: 'Invitados', href: '/attendees', icon: UserPlus },
    { name: 'Confirmaciones', href: '/rsvps', icon: ListChecks },
    { name: 'Recordatorios', href: '/reminders', icon: Send },
    { name: 'Mesas', href: '/tables', icon: Grid },
    { name: 'Invitación Digital', href: '/landing', icon: Globe },
    { name: 'Canciones', href: '/songs', icon: Music },
    { name: 'Ajustes', href: '/settings', icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col fixed inset-y-0 bg-white shadow-md w-64">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-col px-4 mb-6">
          {profileImage ? (
            <div 
              className="w-16 h-16 rounded-full bg-cover bg-center mb-3"
              style={{ backgroundImage: `url(${profileImage})` }}
            />
          ) : (
            <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mb-3">
              <Heart className="h-8 w-8 text-white" />
            </div>
          )}
          <div className="text-center">
            <h1 className="text-xl font-serif text-gray-900 leading-tight min-h-[56px] flex items-center justify-center">
              {groomName && brideName ? (
                <>
                  {groomName}
                  <span className="mx-2">&</span>
                  {brideName}
                </>
              ) : (
                'Mi Boda'
              )}
            </h1>
          </div>
        </div>

        <nav className="mt-4 flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all'
                )}
              >
                <Icon
                  className={cn(
                    isActive
                      ? 'text-rose-600'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-5 w-5 flex-shrink-0'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut()}
          className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
