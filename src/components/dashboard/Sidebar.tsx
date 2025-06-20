import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, UserPlus, ListChecks, Grid, Settings, LogOut, Globe, Music, Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import logoMercadoPago from '../../assets/images/logo.svg';

export function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

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
    <div className="hidden md:flex flex-col fixed inset-y-0 bg-white shadow-md w-64">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <Link to="/" className="flex items-center flex-col px-4 mb-6 hover:opacity-80 transition-opacity">
          <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mb-3">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-serif text-gray-900 leading-tight">
              Tu Parte Digital
            </h1>
          </div>
        </Link>

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
      </div>

      {/* Logout Button */}
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
