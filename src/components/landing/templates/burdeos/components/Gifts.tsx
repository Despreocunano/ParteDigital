import { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import rosa_a from '../assets/rosa_a.webp'
import rosa_b from '../assets/rosa_b.webp'
import rosa_c from '../assets/rosa_c.webp'
import rosa_d from '../assets/rosa_d.webp'

import { InfoModal } from '../../../shared/InfoModal';

interface GiftsProps {
  bankInfo?: {
    accountHolder: string;
    rut: string;
    bank: string;
    accountType: string;
    accountNumber: string;
    email: string;
  };
  couple_code?: string;
  store?: string;
  className?: string;
  textColor?: string;
}

export function Gifts({ bankInfo, couple_code, store, className = '', textColor = '#cfd6bb' }: GiftsProps) {
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

  const handleStoreClick = () => {
    if (!store) return;
    
    let url = '';
    if (store === 'falabella') {
      url = `https://www.falabella.com/falabella-cl/collection/lista-de-regalos?code=${couple_code}`;
    } else if (store === 'paris') {
      url = `https://www.paris.cl/lista-de-regalos/${couple_code}`;
    }
    
    if (url) {
      window.open(url, '_blank');
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
          src={rosa_a}
          alt="Rosa decorativa"
          className="absolute -left-2 md:-left-10 top-[4%] md:top-[7%] -translate-y-1/2 w-16 md:w-56 z-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        />
        
        <motion.img
          src={rosa_b}
          alt="Rosa decorativa"
          className="absolute -left-2 md:-left-12 top-[8%] md:top-[20%] -translate-y-1/2 w-16 md:w-40 z-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        />
                <motion.img
          src={rosa_c}
          alt="Rosa decorativa"
          className="absolute -left-2 md:-left-12 top-[12%] md:top-[35%] -translate-y-1/2 w-16 md:w-40 z-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        />
        <motion.img
          src={rosa_d}
          alt="Rosa decorativa"
          className="absolute -left-2 md:-left-16 top-[15%] md:top-[44%] -translate-y-1/2 w-16 md:w-56 z-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        />


        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={item}
        >
          <motion.div 
            className="w-24 h-24 bg-[#CFD6BA]/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Gift className="w-16 h-16 text-[#c8a784]" />
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-fraunces text-white mb-6">Mesa de Regalos</h2>
                    
          <motion.p 
            className={`text-xl font-sans text-[${textColor}] mb-8 max-w-2xl mx-auto`}
            variants={item}
          >
            Tu presencia es nuestro mejor regalo. Sin embargo, si deseas hacernos un obsequio, aquí tienes la información necesaria.
          </motion.p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {bankInfo && (
              <motion.button
                onClick={() => setShowModal(true)}
                className="bg-[#C5A07F] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-xl font-fraunces mb-2 text-[#540B17]">Datos Bancarios</h3>
                <p className="text-[#33040D] text-lg mb-2 font-sans">
                  Información para transferencia
                </p>
                <div className="bg-[#CFD6BA]/30 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#33040D] font-sans text-sm">
                    Haz clic para ver los datos de transferencia
                  </p>
                </div>
              </motion.button>
            )}

            {couple_code && store && (
              <motion.div
                className="bg-[#C5A07F] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
              >
                <h3 className="text-xl font-fraunces mb-2 text-[#540B17]">Lista de Regalos</h3>
                <p className="text-[#33040D] text-lg mb-2 font-sans">
                  Información de nuestra lista de regalos
                </p>
                <div className="bg-[#CFD6BA]/30 rounded-lg p-3 h-[72px] flex flex-col justify-center">
                  <p className="text-[#33040D] text-lg font-mono">Código: {couple_code}</p>
                  <p className="text-[#33040D] text-sm font-sans">Tienda: {store === 'falabella' ? 'Falabella' : 'Paris'}</p>
                </div>
              </motion.div>
            )}
          </div>

          {!bankInfo && !couple_code && (
            <motion.p 
              className={`text-[${textColor}]`}
              variants={item}
            >
              Pronto encontrarás aquí la información para realizar tu regalo.
            </motion.p>
          )}
        </motion.div>
      </motion.section>

      <InfoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Datos Bancarios"
        icon={Gift}
        iconColor="#540A17"
        overlayColor="#540A17"
      >
        {bankInfo ? (
          <div className="space-y-6">
            <div className="bg-[#CFD6BA]/10 rounded-lg border border-[#CFD6BA]/20 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#00534E]/80">Titular</p>
                  <p className="text-[#00534E]">{bankInfo.accountHolder}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">RUT</p>
                  <p className="text-[#00534E]">{bankInfo.rut}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">Banco</p>
                  <p className="text-[#00534E]">{bankInfo.bank}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">Tipo de Cuenta</p>
                  <p className="text-[#00534E]">{bankInfo.accountType}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">Número de Cuenta</p>
                  <p className="text-[#00534E]">{bankInfo.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">Email</p>
                  <p className="text-[#00534E]">{bankInfo.email}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCopyAll}
              className="bg-[#CFD6BA] text-[#012D27] hover:bg-[#012D27] hover:text-[#CFD6BA] rounded-full border hover:border-[#CFD6BA]"
              leftIcon={copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            >
              {copied ? 'Copiado' : 'Copiar Datos'}
            </Button>
          </div>
        ) : (
          <p className="text-center text-[#CFD6BA]/80 py-8">
            Pronto encontrarás aquí la información bancaria para realizar tu regalo.
          </p>
        )}
      </InfoModal>
    </>
  );
}