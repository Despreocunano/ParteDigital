import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const templates = [
  {
    name: 'Burdeos',
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750127535/burdeos_eckqzg.png',
    link: '/ejemplo/burdeos',
  },
  {
    name: 'Minimalista',
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750228541/minimalista_01_qheez7.png',
    link: '/ejemplo/minimalista',
  },
  {
    name: 'Esmeralda',
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1749837919/esmeralda_pn3bwa.png',
    link: '/ejemplo/esmeralda',
  },
  {
    name: 'Deluxe Jade',
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750228168/jade_ed85lx.png',
    link: '/ejemplo/deluxe-jade',
  },
];

export default function TemplateExamples() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <motion.h2 className="text-4xl md:text-5xl font-bold text-rose-600 mb-8 leading-tight">
            Algunos ejemplos <span className='text-slate-600'>de plantillas</span>
          </motion.h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Elige el diseño que más te inspire y visualiza cómo lucirá tu invitación digital antes de decidirte. Cada plantilla está pensada para que tu evento sea único, elegante y memorable.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {templates.map((tpl) => (
            <div key={tpl.name} className="flex flex-col items-center">
              <img
                src={tpl.preview}
                alt={`Preview ${tpl.name}`}
                className="aspect-[3/5] max-h-[300px] rounded-xl object-cover mb-2"
              />
              <span className="block text-base text-gray-800 tracking-wide mb-2 uppercase letter-spacing-[0.08em] text-center">
                {tpl.name}
              </span>
              <Link
                to={tpl.link}
                className="inline-block px-6 py-2 rounded-full bg-rose-600 text-white shadow hover:bg-rose-700 transition-all duration-300 text-sm mt-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                ver demo
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 