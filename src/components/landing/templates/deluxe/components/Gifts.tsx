import React, { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { toast } from 'react-hot-toast';

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
      <section className={`py-24 px-4 ${className}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-[#D4B572]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-8 h-8 text-[#D4B572]" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-[#D4B572]">Mesa de Regalos</h2>
          
          <p className="text-[#D4B572]/80 mb-8 max-w-2xl mx-auto">
            Tu presencia es nuestro mejor regalo. Sin embargo, si deseas hacernos un obsequio, aquí tienes la información necesaria.
          </p>
          
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#1C2127] rounded-xl p-8 shadow-lg border border-[#D4B572]/20 max-w-md mx-auto w-full hover:bg-[#252B33] transition-colors duration-200"
          >
            <h3 className="text-xl font-serif mb-2 text-[#D4B572]">Ver Datos Bancarios</h3>
            <p className="text-[#D4B572]/80 text-sm">
              Haz clic para ver la información de transferencia
            </p>
          </button>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C2127]/95 backdrop-blur-sm">
          <div className="relative w-full max-w-lg mx-4 bg-[#1C2127] border border-[#D4B572]/20 rounded-xl shadow-xl p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-serif text-[#D4B572] mb-2">Datos Bancarios</h2>
              </div>

              {bankInfo ? (
                <div className="space-y-4">
                  <div className="bg-[#1C2127]/50 rounded-lg border border-[#D4B572]/10 p-4">
                    <div className="space-y-2">
                      <p className="text-[#D4B572]">{bankInfo.accountHolder}</p>
                      <p className="text-[#D4B572]">{bankInfo.rut}</p>
                      <p className="text-[#D4B572]">{bankInfo.accountType}</p>
                      <p className="text-[#D4B572]">{bankInfo.accountNumber}</p>
                      <p className="text-[#D4B572]">{bankInfo.bank}</p>
                      <p className="text-[#D4B572]">{bankInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <Button
                      onClick={handleCopyAll}
                      className="bg-[#D4B572] hover:bg-[#C4A562] text-[#1C2127] px-8 py-3"
                      leftIcon={copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    >
                      {copied ? 'Copiado' : 'Copiar Datos'}
                    </Button>
                    <Button
                      onClick={() => setShowModal(false)}
                      variant="outline"
                      className="border-[#D4B572]/20 text-[#D4B572] hover:bg-[#D4B572]/10"
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-[#D4B572]/80 py-8">
                  Pronto encontrarás aquí la información bancaria para realizar tu regalo.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}