import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, Calendar, Users, Globe, Check, ArrowRight,
  Music2, Clock, MapPin, Gift, CalendarDays, Image,
  UserCheck, Instagram, Shirt, Lock, Settings, Link as LinkIcon,
  Home, UtensilsCrossed, Bus, LayoutDashboard, Send, Table2
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// Import local images
import app1 from '../assets/images/app_00001.png';
import app2 from '../assets/images/app_00002.png';
import app3 from '../assets/images/app_00003.png';
import app4 from '../assets/images/app_00004.png';
import app5 from '../assets/images/app_00005.png';
import app6 from '../assets/images/app_00006.png';
import app7 from '../assets/images/app_00007.png';

const features = [
  {
    icon: Globe,
    title: "Envío ilimitado",
    description: "Comparte tu invitación a través de WhatsApp, Correo Electrónico, Redes Sociales y cualquier plataforma digital",
    color: "emerald"
  },
  {
    icon: Music2,
    title: "Música de fondo",
    description: "El tema musical que desees sonará de fondo en tu invitación",
    color: "purple"
  },
  {
    icon: Clock,
    title: "Cuenta Regresiva",
    description: "Emocionante cuenta regresiva en tiempo real directo a la fecha de tu evento",
    color: "amber"
  },
  {
    icon: MapPin,
    title: "Ubicación e Indicaciones",
    description: "Mapa interactivo con la ubicación del evento, tus invitados llegarán sin complicaciones",
    color: "rose"
  },
  {
    icon: Music2,
    title: "Lista de canciones",
    description: "Tus invitados podrán crear la lista de canciones que no pueden faltar en tu fiesta",
    color: "blue"
  },
  {
    icon: Gift,
    title: "Regalos",
    description: "Tus invitados tendrán la posibilidad de hacerte llegar sus regalos",
    color: "pink"
  },
  {
    icon: CalendarDays,
    title: "Agenda",
    description: "Tus invitados podrán agendar tu evento con un solo clic en sus agendas",
    color: "indigo"
  },
  {
    icon: Image,
    title: "Álbum de fotos",
    description: "Una historia única en un hermoso recorrido fotográfico",
    color: "violet"
  },
  {
    icon: UserCheck,
    title: "Lista de asistentes (RSVP)",
    description: "Tus invitados podrán confirmar su presencia para ayudarte en la lista de invitados final",
    color: "emerald"
  },
  {
    icon: Instagram,
    title: "Instagram Wall",
    description: "Todas las publicaciones de tu evento en único lugar para que todos los invitados participen",
    color: "fuchsia"
  },
  {
    icon: Shirt,
    title: "Dress Code",
    description: "Informa a tus invitados el código o estilo de vestimenta elegido para tu gran día",
    color: "blue"
  },
  {
    icon: Lock,
    title: "Acceso VIP",
    description: "Configura tu invitación en modo privado, solo los invitados con acceso podrán verla",
    color: "gray"
  },
  {
    icon: Settings,
    title: "Acceso de propietario",
    description: "Configura funciones de tu invitación, visualiza lista de invitados y de canciones sugeridas",
    color: "indigo"
  },
  {
    icon: LinkIcon,
    title: "Link personalizable",
    description: "Personaliza el link de tu invitación como más te guste",
    color: "purple"
  },
  {
    icon: Home,
    title: "Alojamiento",
    description: "Recomendaciones de alojamientos para tus invitados lejanos",
    color: "amber"
  },
  {
    icon: UtensilsCrossed,
    title: "Menú",
    description: "Da a conocer las opciones de menú de tu fiesta",
    color: "rose"
  },
  {
    icon: Bus,
    title: "Transporte",
    description: "Da a conocer las opciones de trasporte hasta el lugar",
    color: "emerald"
  }
];

const colorVariants = {
  emerald: "bg-emerald-50 text-emerald-600 shadow-emerald-100/50",
  purple: "bg-purple-50 text-purple-600 shadow-purple-100/50",
  amber: "bg-amber-50 text-amber-600 shadow-amber-100/50",
  rose: "bg-rose-50 text-rose-600 shadow-rose-100/50",
  blue: "bg-blue-50 text-blue-600 shadow-blue-100/50",
  pink: "bg-pink-50 text-pink-600 shadow-pink-100/50",
  indigo: "bg-indigo-50 text-indigo-600 shadow-indigo-100/50",
  violet: "bg-violet-50 text-violet-600 shadow-violet-100/50",
  fuchsia: "bg-fuchsia-50 text-fuchsia-600 shadow-fuchsia-100/50",
  gray: "bg-gray-50 text-gray-600 shadow-gray-100/50"
};

const featureSections = [
  {
    title: "Panel Principal Intuitivo",
    description: "Tu centro de control completo para una boda perfecta. Visualiza estadísticas en tiempo real, gestiona todos los aspectos de tu evento y mantén todo organizado en un solo lugar. Con nuestro dashboard intuitivo, tendrás el poder de crear una experiencia única para ti y tus invitados.",
    image: app1,
    icon: LayoutDashboard,
    features: [
      "Estadísticas en tiempo real",
      "Vista general de confirmaciones",
      "Acceso rápido a todas las funciones",
      "Interfaz intuitiva y fácil de usar"
    ]
  },
  {
    title: "Gestión de Invitados Simplificada",
    description: "Olvídate de las hojas de cálculo y las listas en papel. Nuestra gestión de invitados te permite mantener toda la información organizada, actualizada y accesible. Añade, edita y gestiona tu lista de invitados con facilidad, incluyendo detalles importantes como preferencias alimentarias y acompañantes.",
    image: app2,
    icon: Users,
    features: [
      "Gestión completa de invitados",
      "Control de acompañantes",
      "Preferencias alimentarias",
      "Información de contacto centralizada"
    ]
  },
  {
    title: "Confirmaciones en Tiempo Real",
    description: "Mantente al día con las confirmaciones de asistencia de forma automática. Nuestro sistema RSVP digital permite a tus invitados confirmar su asistencia de manera sencilla, mientras tú recibes actualizaciones instantáneas y mantienes un control total sobre la lista final de asistentes.",
    image: app3,
    icon: Check,
    features: [
      "Confirmaciones automáticas",
      "Estadísticas en tiempo real",
      "Gestión de acompañantes",
      "Seguimiento de respuestas"
    ]
  },
  {
    title: "Sistema de Recordatorios Inteligente",
    description: "Mantén a tus invitados informados sin esfuerzo. Nuestro sistema de recordatorios te permite enviar mensajes personalizados a tus invitados, asegurando que nadie se pierda los detalles importantes de tu gran día. Programa recordatorios automáticos y mantén a todos actualizados.",
    image: app4,
    icon: Send,
    features: [
      "Recordatorios personalizados",
      "Programación automática",
      "Seguimiento de envíos",
      "Plantillas prediseñadas"
    ]
  },
  {
    title: "Organizador de Mesas Digital",
    description: "Diseña la distribución perfecta para tu evento con nuestro organizador de mesas digital. Arrastra y suelta invitados, gestiona capacidades y visualiza la disposición completa de tu evento. Una herramienta poderosa que hace que la organización de mesas sea un juego de niños.",
    image: app5,
    icon: Table2,
    features: [
      "Distribución visual de mesas",
      "Gestión de capacidades",
      "Asignación automática",
      "Vista previa en tiempo real"
    ]
  },
  {
    title: "Invitación Digital Elegante",
    description: "Crea una invitación digital única que refleje tu estilo. Con diseños elegantes y personalizables, música de fondo, galería de fotos y toda la información importante de tu evento, tus invitados tendrán una experiencia inolvidable desde el primer momento.",
    image: app6,
    icon: Globe,
    features: [
      "Diseños personalizables",
      "Música de fondo",
      "Galería de fotos",
      "Información interactiva"
    ]
  },
  {
    title: "Playlist Colaborativa",
    description: "Haz que tu fiesta sea inolvidable con la música perfecta. Permite que tus invitados sugieran sus canciones favoritas y crea la banda sonora perfecta para tu celebración. Una forma única de hacer que todos sean parte de la fiesta incluso antes de que comience.",
    image: app7,
    icon: Music2,
    features: [
      "Sugerencias de invitados",
      "Lista de reproducción colaborativa",
      "Gestión de canciones",
      "Exportación de playlist"
    ]
  }
];

export function PublicSite() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-10"></div>
          <img 
            src="https://images.pexels.com/photos/1589820/pexels-photo-1589820.jpeg"
            alt="Wedding background"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            className="flex-1 text-center md:text-left"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Tu historia de amor merece una invitación única
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Crea una experiencia digital mágica para tu boda
            </p>
            <p className="text-2xl md:text-3xl text-white font-light mb-12">
              ¡Comienza tu historia hoy!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => window.location.href = 'https://panel.tuparte.digital/register'}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-8 group"
                >
                  <span>Crear mi invitación</span>
                  <Heart className="ml-2 h-5 w-5 group-hover:text-white transition-transform group-hover:scale-125" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = 'https://panel.tuparte.digital/register'}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 px-8"
                >
                  Ver Modelos
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1 max-w-[280px]"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
              <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
              <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
              <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800">
                <div className="relative h-full">
                  <img
                    src="https://images.pexels.com/photos/1589820/pexels-photo-1589820.jpeg"
                    className="absolute inset-0 h-full w-full object-cover"
                    alt="Wedding invitation preview"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 flex flex-col items-center justify-center text-white p-6">
                    <div className="absolute top-0 left-0 right-0 h-6 bg-black/80"></div>
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    >
                      <h3 className="text-2xl font-serif mb-4">Juan & María</h3>
                      <p className="text-sm mb-8">12 de Octubre, 2024</p>
                    </motion.div>
                    <div className="space-y-3 w-full">
                      <motion.button
                        className="w-full bg-white text-gray-900 rounded-lg py-2 text-sm font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        AGENDAR
                      </motion.button>
                      <motion.button
                        className="w-full bg-white/20 text-white rounded-lg py-2 text-sm font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        CONFIRMAR ASISTENCIA
                      </motion.button>
                      <motion.button
                        className="w-full bg-white/20 text-white rounded-lg py-2 text-sm font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ¿CÓMO LLEGAR?
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="flex flex-col items-center text-white/80">
            <p className="text-sm mb-2">Descubre más</p>
            <div className="w-[2px] h-8 bg-white/50"></div>
          </div>
        </motion.div>
      </section>

      {/* Feature Sections */}
      {featureSections.map((section, index) => {
        const isEven = index % 2 === 0;
        const Icon = section.icon;
        
        return (
          <motion.section 
            key={index} 
            className={`py-24 px-4 ${isEven ? 'bg-white' : 'bg-gray-50'}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-7xl mx-auto">
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <motion.div 
                  className="flex-1"
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-rose-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {section.description}
                  </p>
                  <ul className="space-y-4">
                    {section.features.map((feature, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-center text-gray-700"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                      >
                        <Check className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div 
                  className="flex-1"
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-rose-100 to-indigo-100 rounded-xl opacity-30 blur-xl"></div>
                    <motion.img
                      src={section.image}
                      alt={section.title}
                      className="relative rounded-xl shadow-2xl w-full"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        );
      })}

      {/* Features Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
              Características que harán tu invitación única
            </h2>
            <p className="text-lg text-gray-600">
              Todo lo que necesitas para crear una experiencia inolvidable
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = colorVariants[feature.color as keyof typeof colorVariants];
              
              return (
                <motion.div 
                  key={index} 
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses} transition-all duration-300 group-hover:scale-110`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              size="lg"
              onClick={() => window.location.href = 'https://panel.tuparte.digital/register'}
              className="bg-rose-500 hover:bg-rose-600 text-white px-8 group"
            >
              <span>Comenzar ahora</span>
              <Heart className="ml-2 h-5 w-5 group-hover:text-white transition-transform group-hover:scale-125" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Heart className="h-8 w-8 text-rose-500 mx-auto mb-4" />
            <p className="text-gray-600">
              © {new Date().getFullYear()} Tu Parte Digital. Todos los derechos reservados.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}