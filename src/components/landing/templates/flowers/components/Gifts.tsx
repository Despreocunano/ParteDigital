import { useState } from 'react';
import { Gift, Copy, Check, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Divider } from './Divider';

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
        className={`py-24 px-4 ${className}`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={item}
        >
          <motion.div 
            className="w-16 h-16 bg-[#E8A87C]/20 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Gift className="w-8 h-8 text-[#8B4513]" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-[#8B4513]">Mesa de Regalos</h2>
          
          <Divider className="mb-8" />
          
          <motion.p 
            className="text-[#8B4513]/80 mb-8 max-w-2xl mx-auto"
            variants={item}
          >
            Tu presencia es nuestro mejor regalo. Sin embargo, si deseas hacernos un obsequio, aquí tienes la información necesaria.
          </motion.p>
          
          <motion.button
            onClick={() => setShowModal(true)}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-[#E8A87C]/30 max-w-md mx-auto w-full hover:bg-white/90 transition-colors duration-200"
            variants={item}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="text-xl font-serif mb-2 text-[#8B4513]">Ver Datos Bancarios</h3>
            <p className="text-[#8B4513]/80 text-sm">
              Haz clic para ver la información de transferencia
            </p>
          </motion.button>
        </motion.div>
      </motion.section>

      <AnimatePresence>
        {showModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDF8F5]/95 backdrop-blur-sm"
          >
            <div 
              className="relative w-full max-w-2xl px-8 py-12 text-center text-[#8B4513]"
            >
              {/* Floral corner decorations */}
              <div className="absolute top-0 left-0 w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
                  <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
                  <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 rotate-90">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
                  <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
                  <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 w-16 h-16 -rotate-90">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
                  <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
                  <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 rotate-180">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#E8A87C]/30">
                  <path d="M20 20 C10 30, 10 50, 20 60 C30 50, 30 30, 20 20 Z" fill="currentColor"/>
                  <path d="M10 40 C20 30, 40 30, 50 40 C40 50, 20 50, 10 40 Z" fill="currentColor"/>
                </svg>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#E8A87C]/10 hover:bg-[#E8A87C]/20 transition-colors z-10"
              >
                <X className="w-5 h-5 text-[#8B4513]" />
              </button>

              <div className="space-y-8">
                <div className="w-16 h-16 bg-[#E8A87C]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h2 className="text-3xl font-serif">Datos Bancarios</h2>

                {bankInfo ? (
                  <div className="space-y-6">
                    <div className="bg-white/50 rounded-lg border border-[#E8A87C]/20 p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#8B4513]/60">Titular</p>
                          <p className="text-[#8B4513]">{bankInfo.accountHolder}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8B4513]/60">RUT</p>
                          <p className="text-[#8B4513]">{bankInfo.rut}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8B4513]/60">Banco</p>
                          <p className="text-[#8B4513]">{bankInfo.bank}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8B4513]/60">Tipo de Cuenta</p>
                          <p className="text-[#8B4513]">{bankInfo.accountType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8B4513]/60">Número de Cuenta</p>
                          <p className="text-[#8B4513]">{bankInfo.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8B4513]/60">Email</p>
                          <p className="text-[#8B4513]">{bankInfo.email}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleCopyAll}
                      className="bg-[#8B4513] hover:bg-[#A0522D] text-white px-8 py-3"
                      leftIcon={copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    >
                      {copied ? 'Copiado' : 'Copiar Datos'}
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-[#8B4513]/80 py-8">
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