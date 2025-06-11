import { useState } from 'react';
import { Gift, Copy, Check, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import divider from '../assets/divider.svg'
import rosa_a from '../assets/Grupo02_a.webp'
import rosa_b from '../assets/Grupo02_b.webp'
import rosa_c from '../assets/Grupo02_c.webp'
import modal from '../assets/modal.svg'

interface GiftsProps {
  bankInfo?: {
    accountHolder: string;
    rut: string;
    bank: string;
    accountType: string;
    accountNumber: string;
    email: string;
  };
  className?: string;
}

export function Gifts({ bankInfo, className = '' }: GiftsProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const handleCopyAll = async () => {
    if (!bankInfo) return;

    const text = `${bankInfo.accountHolder}
${bankInfo.rut}
${bankInfo.accountType}
${bankInfo.accountNumber}
${bankInfo.bank}
${bankInfo.email}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Datos copiados al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Error al copiar los datos');
    }
  };

  return (
    <>
      <motion.section 
        className={`py-24 px-4 ${className} relative`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        {/* Rosas decorativas */}
        <motion.img
          src={rosa_c}
          alt="Rosa decorativa"
          className="absolute -left-8 md:-left-16 top-1/4 -translate-y-1/2 w-32 md:w-64"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.img
          src={rosa_b}
          alt="Rosa decorativa"
          className="absolute -left-8 md:-left-16 top-1/4 -translate-y-1/2 w-32 md:w-64"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
        <motion.img
          src={rosa_a}
          alt="Rosa decorativa"
          className="absolute -left-8 md:-left-16 top-1/4 -translate-y-1/2 w-32 md:w-64"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        />

        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={item}
        >
          <motion.div 
            className="w-24 h-24 bg-[#F8BBD9]/30 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Gift className="w-16 h-16 text-[#BC913B]" />
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-parisienne text-white mb-6">Mesa de Regalos</h2>
          
          <img src={divider} alt="Divider" className="mx-auto mb-8" />
          
          <motion.p 
            className="text-xl text-[#cfd6bb] mb-4 max-w-2xl mx-auto"
            variants={item}
          >
            Tu presencia es nuestro mejor regalo. Sin embargo, si deseas hacernos un obsequio, aquí tienes la información necesaria.
          </motion.p>
          
          <motion.button
            onClick={() => setShowModal(true)}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#F8BBD9]/50 max-w-md mx-auto w-full hover:bg-white transition-colors duration-200 relative"
            variants={item}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Cherry blossom decoration */}
            <div className="absolute top-4 right-4">
              <svg width="25" height="25" viewBox="0 0 25 25">
                <circle cx="12.5" cy="12.5" r="3" fill="#F8BBD9" opacity="0.6"/>
                <circle cx="10" cy="10" r="2" fill="#FCE4EC"/>
                <circle cx="15" cy="10" r="2" fill="#FCE4EC"/>
                <circle cx="10" cy="15" r="2" fill="#FCE4EC"/>
                <circle cx="15" cy="15" r="2" fill="#FCE4EC"/>
                <circle cx="12.5" cy="12.5" r="1" fill="#E91E63"/>
              </svg>
            </div>
            <h3 className="text-xl font-serif mb-2 text-[#2D1B69]">Ver Datos Bancarios</h3>
            <p className="text-[#8D6E63] text-sm">
              Haz clic para ver la información de transferencia
            </p>
          </motion.button>
        </motion.div>
      </motion.section>

      <AnimatePresence>
        {showModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF3F4]"
          >
            <div 
              className="relative w-full max-w-2xl px-12 py-12 text-center text-[#2D1B69]"
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-24 h-24">
                <img src={modal} />
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 scale-x-[-1]">
                <img src={modal} />
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-24 scale-y-[-1]">
                <img src={modal} />
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 scale-[-1]">
                <img src={modal} />
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-12 right-12 w-8 h-8 flex items-center justify-center rounded-full bg-[#F8BBD9]/20 hover:bg-[#F8BBD9]/40 transition-colors z-20"
              >
                <X className="w-5 h-5 text-[#2D1B69]" />
              </button>

              <div className="space-y-8">
                <div className="w-24 h-24 bg-[#F8BBD9]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-16 h-16 text-[#BC913B]" />
                </div>
                <h2 className="text-3xl font-serif">Datos Bancarios</h2>

                {bankInfo ? (
                  <div className="space-y-6">
                    <div className="bg-white/50 rounded-lg border border-[#F8BBD9]/30 p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#8D6E63]">Titular</p>
                          <p className="text-[#2D1B69]">{bankInfo.accountHolder}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8D6E63]">RUT</p>
                          <p className="text-[#2D1B69]">{bankInfo.rut}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8D6E63]">Banco</p>
                          <p className="text-[#2D1B69]">{bankInfo.bank}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8D6E63]">Tipo de Cuenta</p>
                          <p className="text-[#2D1B69]">{bankInfo.accountType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8D6E63]">Número de Cuenta</p>
                          <p className="text-[#2D1B69]">{bankInfo.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8D6E63]">Email</p>
                          <p className="text-[#2D1B69]">{bankInfo.email}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleCopyAll}
                      className="bg-[#E91E63] hover:bg-[#C2185B] text-white px-8 py-3"
                      leftIcon={copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    >
                      {copied ? 'Copiado' : 'Copiar Datos'}
                    </Button>
                  </div>
                ) : (
                  <p className="text-xl text-center text-[#8D6E63]">
                    Pronto encontrarás aquí la información bancaria para realizar tu regalo.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}