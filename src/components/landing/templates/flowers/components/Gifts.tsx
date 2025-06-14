import { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
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
}

export function Gifts({ bankInfo, couple_code, store, className = '' }: GiftsProps) {
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
            <Gift className="w-8 h-8 text-[#E8A87C]" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-[#8B4513]">Mesa de Regalos</h2>

          <motion.p 
            className="text-[#8B4513]/80 text-lg mb-8 max-w-2xl mx-auto"
            variants={item}
          >
            Tu presencia es nuestro mejor regalo. Sin embargo, si deseas hacernos un obsequio, aquí tienes la información necesaria.
          </motion.p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {bankInfo && (
              <motion.button
                onClick={() => setShowModal(true)}
                className="bg-[#FDF8F5] rounded-xl p-8 shadow-lg border border-[#E8A87C]/20 w-full md:w-[400px] hover:bg-[#F5EDE8] transition-colors duration-200"
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-xl font-serif mb-2 text-[#8B4513]">Datos Bancarios</h3>
                <p className="text-[#8B4513]/80 text-sm mb-2">
                  Información para transferencia
                </p>
                <div className="bg-[#E8A87C]/10 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#8B4513] text-sm">
                    Haz clic para ver los datos de transferencia
                  </p>
                </div>
              </motion.button>
            )}

            {couple_code && store && (
              <motion.div
                className="bg-[#FDF8F5] rounded-xl p-8 shadow-lg border border-[#E8A87C]/20 w-full md:w-[400px]"
                variants={item}
              >
                <h3 className="text-xl font-serif mb-2 text-[#8B4513]">Lista de Regalos</h3>
                <p className="text-[#8B4513]/80 text-sm mb-2">
                  Información de nuestra lista de regalos
                </p>
                <div className="bg-[#E8A87C]/10 rounded-lg p-3 h-[72px] flex flex-col justify-center">
                  <p className="text-[#8B4513] text-sm font-mono">Código: {couple_code}</p>
                  <p className="text-[#8B4513]/80 text-xs">Tienda: {store === 'falabella' ? 'Falabella' : 'Paris'}</p>
                </div>
              </motion.div>
            )}
          </div>

          {!bankInfo && !couple_code && (
            <motion.p 
              className="text-[#E8A87C]/80"
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
        iconColor="#E8A87C"
        overlayColor="#FDF8F5"
      >
        {bankInfo ? (
          <div className="space-y-6">
            <div className="bg-[#E8A87C]/10 rounded-lg border border-[#E8A87C]/20 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#E8A87C]/80">Titular</p>
                  <p className="text-[#E8A87C]">{bankInfo.accountHolder}</p>
                </div>
                <div>
                  <p className="text-sm text-[#E8A87C]/80">RUT</p>
                  <p className="text-[#E8A87C]">{bankInfo.rut}</p>
                </div>
                <div>
                  <p className="text-sm text-[#E8A87C]/80">Banco</p>
                  <p className="text-[#E8A87C]">{bankInfo.bank}</p>
                </div>
                <div>
                  <p className="text-sm text-[#E8A87C]/80">Tipo de Cuenta</p>
                  <p className="text-[#E8A87C]">{bankInfo.accountType}</p>
                </div>
                <div>
                  <p className="text-sm text-[#E8A87C]/80">Número de Cuenta</p>
                  <p className="text-[#E8A87C]">{bankInfo.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-[#E8A87C]/80">Email</p>
                  <p className="text-[#E8A87C]">{bankInfo.email}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCopyAll}
              className="bg-[#E8A87C] text-[#FDF8F5] hover:bg-[#FDF8F5] hover:text-[#E8A87C] rounded-full border hover:border-[#E8A87C]"
              leftIcon={copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            >
              {copied ? 'Copiado' : 'Copiar Datos'}
            </Button>
          </div>
        ) : (
          <p className="text-center text-[#E8A87C]/80 py-8">
            Pronto encontrarás aquí la información bancaria para realizar tu regalo.
          </p>
        )}
      </InfoModal>
    </>
  );
}