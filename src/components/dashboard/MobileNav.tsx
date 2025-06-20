import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, UserPlus, ListChecks, Grid, Settings, LogOut, Globe, Music, Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import logoMercadoPago from '../../assets/images/logo.svg';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const toggleNav = () => setIsOpen(!isOpen);

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
      name: 'Confirmaciones',
      href: '/rsvps',
      icon: ListChecks
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
      href: '/songs',
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
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg text-gray-900 leading-tight">
              Tu Parte Digital
            </h1>
          </div>
        </Link>
        <button onClick={toggleNav} className="text-gray-500 focus:outline-none">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-10 flex bg-black bg-opacity-50">
          <div className="w-64 bg-white h-full overflow-y-auto shadow-lg flex flex-col">
            <Link to="/" className="flex flex-col items-center px-4 py-6 border-b border-gray-200 hover:opacity-80 transition-opacity">
              <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mb-3">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-xl text-gray-900 text-center leading-tight">
                Tu Parte Digital
              </h1>
            </Link>
            <nav className="mt-5 px-4 space-y-1 flex-1">
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
                    onClick={() => setIsOpen(false)}
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

            {/* MercadoPago Logo */}
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex flex-col items-center space-y-2">
                <img 
                  src={logoMercadoPago} 
                  alt="MercadoPago" 
                  className="h-8 w-auto opacity-70"
                />
                <p className="text-xs text-gray-500 text-center leading-tight">
                  Paga con el respaldo de MercadoPago
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <div className="px-4 py-4 border-t border-gray-200">
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                Cerrar sesión
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsOpen(false)}></div>
        </div>
      )}
    </div>
  );
}
