import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, UserPlus, ListChecks, Grid, Settings, LogOut, Globe, Music, Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const toggleNav = () => {
    setIsOpen(!isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  };

  const navigation = [
    {
      name: 'Panel',
      href: '/',
      icon: Heart
    },
    {
      name: 'Invitación Digital',
      href: '/landing',
      icon: Globe
    },
    {
      name: 'Invitados',
      href: '/attendees',
      icon: UserPlus
    },
    {
      name: 'Mesas',
      href: '/tables',
      icon: Grid
    },
    {
      name: 'Recordatorios',
      href: '/reminders',
      icon: Send
    },
    {
      name: 'Música',
      href: '/music',
      icon: Music
    },
    {
      name: 'Configuración',
      href: '/settings',
      icon: Settings
    }
  ];

  return (
    <div className="md:hidden">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-serif text-gray-900 leading-tight">
              Tu Parte Digital
            </h1>
          </div>
        </Link>
        <button onClick={toggleNav} className="text-gray-500 focus:outline-none">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex bg-black bg-opacity-50">
          <div className="w-64 bg-white h-full overflow-y-auto shadow-lg">
            <Link to="/" className="flex flex-col items-center px-4 py-6 border-b border-gray-200 hover:opacity-80 transition-opacity">
              <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mb-3">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-xl font-serif text-gray-900 text-center leading-tight">
                Tu Parte Digital
              </h1>
            </Link>
            <nav className="mt-5 px-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                    pathname === item.href
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Cerrar sesión
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
