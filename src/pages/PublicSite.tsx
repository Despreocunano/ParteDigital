import { motion } from 'framer-motion';
import { 
  Heart, Users, Globe, Check,
  Music2, Clock, MapPin, Gift, CalendarDays, Image,
  Instagram, Shirt, Lock, Link as LinkIcon, UtensilsCrossed, LayoutDashboard, Table2, User
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useState, useEffect } from 'react';
import { DemoCarousel } from '../components/public/DemoCarousel';
import { trackEvent } from '../lib/analytics';
import TemplateExamples from '../components/public/TemplateExamples';

// Import local images
import app1 from '../assets/images/app_gestion.png';
import app2 from '../assets/images/app_compartir.png';
import app3 from '../assets/images/app_invitados.png';
import app5 from '../assets/images/app_mesas.png';
import herobg from '../assets/images/hero_public.webp';

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
    icon: LinkIcon,
    title: "Link personalizable",
    description: "Personaliza el link de tu invitación como más te guste",
    color: "purple"
  },
  {
    icon: UtensilsCrossed,
    title: "Menú",
    description: "Da a conocer las opciones de menú de tu fiesta",
    color: "rose"
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
    title: "Confirmaciones en tiempo real",
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
    title: "Crea y comparte en minutos",
    description: "Selecciona el diseño que mas te guste, completa la información necesaria, música de fondo, galería de fotos y compartela con tus invitados que tendrán una experiencia inolvidable desde el primer momento.",
    image: app2,
    icon: LayoutDashboard,
    features: [
      "Comparte directamente en whatsapp",
      "Música de fondo",
      "Galería de fotos",
      "Información interactiva"
    ]
  },
  {
    title: "Gestión de invitados",
    description: "Olvídate de las hojas de cálculo y las listas en papel. Nuestra gestión de invitados te permite mantener toda la información organizada, actualizada y accesible. Añade, edita y gestiona tu lista de invitados con facilidad, incluyendo detalles importantes como preferencias alimentarias y acompañantes.",
    image: app1,
    icon: Users,
    features: [
      "Gestión completa de invitados",
      "Control de acompañantes",
      "Preferencias alimentarias",
      "Información de contacto centralizada"
    ]
  },
  {
    title: "Organizador de mesas digitales",
    description: "Diseña la distribución perfecta para tu evento con nuestro organizador de mesas digital. Agrega y elimina invitados, gestiona capacidades y visualiza la disposición completa de tu evento. Una herramienta poderosa que hace que la organización de mesas sea un juego de niños.",
    image: app5,
    icon: Table2,
    features: [
      "Distribución visual de mesas",
      "Gestión de capacidades",
      "Vista previa en tiempo real"
    ]
  }
];

export function PublicSite() {
  const [isScrolled, setIsScrolled] = useState(false);
  const isPanel = window.location.hostname.startsWith('panel.');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/60 backdrop-blur-md shadow-sm' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-rose-500" />
              <span className="ml-2 text-xl font-semibold text-white">Tu Parte Digital</span>
            </div>
            <div>
              <a
                href="https://panel.tuparte.digital/auth?showLogin=true"
                onClick={() => trackEvent('cta_click', { 
                  location: 'header',
                  button_text: isPanel ? 'Crear mi invitación' : 'Iniciar sesión'
                })}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                <User className="h-4 w-4 mr-2" />
                {isPanel ? (
                  <>
                    Crear mi invitación
                    <img src="https://flagcdn.com/cl.svg" alt="Chile" className="ml-2 h-4 w-6 object-cover rounded-sm shadow inline-block align-middle" />
                  </>
                ) : (
                  <>
                    Iniciar sesión
                    <img src="https://flagcdn.com/cl.svg" alt="Chile" className="ml-2 h-4 w-6 object-cover rounded-sm shadow inline-block align-middle" />
                  </>
                )}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0)_70%)] z-10"></div>
          <img 
            src={herobg}
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
            <div className="inline-block mb-6">
              <motion.div 
                className="w-24 h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-200 to-rose-400">
                Tu historia de amor
              </span>
              <br />
              merece una invitación única
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-6 md:mb-8 font-light">
              Crea una experiencia digital mágica para tu boda
            </p>
            <p className="text-xl md:text-3xl text-white font-light mb-8 md:mb-12">
              No pagues de más, tu parte por solo $39.990
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <a
                  href="https://panel.tuparte.digital/auth"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('cta_click', { 
                    location: 'hero_section',
                    button_text: 'Crear mi invitación'
                  })}
                  className="inline-flex items-center justify-center w-full px-8 py-4 text-lg rounded-md bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white transition-all duration-300 group shadow-lg shadow-rose-500/25"
                >
                  <span>Crear mi invitación</span>
                  <Heart className="ml-2 h-5 w-5 group-hover:text-white transition-transform group-hover:scale-125" />
                </a>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    const featuresTitle = document.querySelector('.features-title');
                    if (featuresTitle) {
                      featuresTitle.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 px-8 py-4 backdrop-blur-sm"
                >
                  Ver características
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1 max-w-[280px] hidden md:block"
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
                      <p className="text-sm mb-8">12 de Octubre, 2026</p>
                    </motion.div>
                    <div className="space-y-3 w-full">
                      <motion.button
                        className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg py-2 text-sm font-medium shadow-lg shadow-rose-500/25"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        AGENDAR
                      </motion.button>
                      <motion.button
                        className="w-full bg-white/20 text-white rounded-lg py-2 text-sm font-medium backdrop-blur-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        CONFIRMAR ASISTENCIA
                      </motion.button>
                      <motion.button
                        className="w-full bg-white/20 text-white rounded-lg py-2 text-sm font-medium backdrop-blur-sm"
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
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <motion.div
                className="w-1.5 h-1.5 bg-white/80 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Step by Step Process */}
      <section className="py-32 bg-gradient-to-b from-white via-rose-50/20 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-rose-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >

            <h2 className="text-4xl md:text-5xl font-bold text-rose-600 mb-8 leading-tight">
                En solo 4 pasos
              <br />
              <span className="text-slate-600">tendrás tu invitación lista</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Un proceso diseñado para ser simple, rápido y divertido. 
              <span className="text-rose-600 font-semibold"> Sin complicaciones, solo resultados increíbles.</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Crea tu cuenta",
                description: "Regístrate de forma gratuita y accede a todas los diseños disponibles. ¡Solo toma 30 segundos!",
                icon: User,
                color: "from-blue-500 via-blue-600 to-indigo-600",
                bgColor: "from-blue-50 to-indigo-50",
                accentColor: "blue"
              },
              {
                step: "02",
                title: "Elige el diseño y completa tu información",
                description: "Elige entre más de 10 diseños únicos y personaliza cada detalle de tu boda",
                icon: LayoutDashboard,
                color: "from-purple-500 via-purple-600 to-violet-600",
                bgColor: "from-purple-50 to-violet-50",
                accentColor: "purple"
              },
              {
                step: "03",
                title: "Visualiza tu parte digital",
                description: "Revisa cómo se ve tu invitación en tiempo real y haz los ajustes necesarios hasta que quede exactamente como quieres",
                icon: Globe,
                color: "from-emerald-500 via-emerald-600 to-teal-600",
                bgColor: "from-emerald-50 to-teal-50",
                accentColor: "emerald"
              },
              {
                step: "04",
                title: "Publícalo y comparte con tus amigos",
                description: "Activa tu invitación con un clic por solo $39.990 y compártela instantáneamente con todos tus invitados",
                icon: Heart,
                color: "from-rose-500 via-rose-600 to-pink-600",
                bgColor: "from-rose-50 to-pink-50",
                accentColor: "rose"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Step number with enhanced design */}
                  <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-2xl group-hover:scale-105 transition-transform duration-300 z-20">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                      {item.step}
                    </span>
                  </div>

                  {/* Enhanced card with gradient background */}
                  <div className={`relative bg-gradient-to-br ${item.bgColor} rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/50 backdrop-blur-sm group-hover:border-${item.accentColor}-200 overflow-hidden`}>
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent rounded-full"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-current to-transparent rounded-full"></div>
                    </div>

                    {/* Icon with enhanced styling */}
                    <div className={`relative w-20 h-20 bg-gradient-to-r ${item.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-10 w-10 text-white drop-shadow-lg" />
                      {/* Glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-600 mb-6 group-hover:text-slate-800 transition-colors duration-300 leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {item.description}
                    </p>

                    {/* Enhanced arrow connector for desktop */}
                    {index < 3 && (
                      <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-transparent rounded-full"></div>
                          <div className="w-4 h-4 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
                        </div>
                      </div>
                    )}

                    {/* Floating decorative elements */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-6 right-6 w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Enhanced CTA section */}
          <motion.div 
            className="text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            
          >
            <TemplateExamples />
          </motion.div>
        </div>
      </section>

      {/* Demo Carousel */}
      <DemoCarousel />

      {/* Feature Sections */}
      <div className="text-center mb-16 pt-24 features-title">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-rose-600 mb-8 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
            Características
           <span className='text-slate-600'> que harán tu invitación única</span>
        </motion.h2>
        <motion.p 
          className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Todo lo que necesitas para crear una experiencia inolvidable
        </motion.p>
      </div>

      {featureSections.map((section, index) => {
        const isEven = index % 2 === 0;
        const Icon = section.icon;
        
        return (
          <motion.section 
            key={index} 
            className={`py-24 px-4 feature-sections ${isEven ? 'bg-white' : 'bg-gradient-to-b from-rose-50/30 to-white'}`}
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
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center shadow-lg shadow-rose-100/50">
                      <Icon className="w-8 h-8 text-rose-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-600">
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
                        className="flex items-center text-gray-700 group"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                          <Check className="w-4 h-4 text-rose-600" />
                        </div>
                        <span className="group-hover:text-rose-600 transition-colors duration-300">{feature}</span>
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
                      className="relative w-full rounded-lg shadow-xl"
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
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-rose-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0)_70%)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Crea tu invitación en menos de 5 minutos
                </h2>
                <p className="text-white/90 text-lg">
                  Regístrate ahora, ingresa los datos de tu evento y visualiza tu invitación digital.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => {
                    trackEvent('cta_click', { 
                      location: 'features_final',
                      button_text: 'Crear mi invitación'
                    });
                    window.location.href = 'https://panel.tuparte.digital/register';
                  }}
                  className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-8 group shadow-lg shadow-rose-500/25"
                >
                  <span>Crear mi invitación</span>
                  <Heart className="ml-2 h-5 w-5 group-hover:text-white transition-transform group-hover:scale-125" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-b from-white to-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-600">
                Desbloquea todas
              </span> las características por $39.990
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Todo lo que necesitas en un solo lugar y listo en menos de 5 minutos
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = colorVariants[feature.color as keyof typeof colorVariants];
              
              return (
                <motion.div 
                  key={index} 
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50 overflow-hidden hover:border-rose-100/50 transition-all duration-300"
                  initial={{ opacity: 0, rotateX: 15 }}
                  whileInView={{ 
                    opacity: 1,
                    rotateX: 0,
                    transformPerspective: 1000,
                    transformStyle: "preserve-3d"
                  }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.6,
                    type: "spring",
                    damping: 10
                  }}
                  whileHover={{
                    y: -10,
                    rotateX: 5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start gap-4">
                    <motion.div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses} group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-rose-50/30 to-white border-t border-rose-100/50 py-12">
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