import React, { useState } from 'react';
import { Gift, Copy, Check, X } from 'lucide-react';
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
          <div className="relative w-full max-w-2xl px-8 py-12 text-center text-[#D4B572]">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#D4B572]/30"></div>
            <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-[#D4B572]/30"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-[#D4B572]/30"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-[#D4B572]/30"></div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#D4B572]/10 hover:bg-[#D4B572]/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-[#D4B572]" />
            </button>

            <div className="space-y-8">
              <h2 className="text-3xl font-serif">Datos Bancarios</h2>

              {bankInfo ? (
                <div className="space-y-6">
                  <div className="bg-[#1C2127]/50 rounded-lg border border-[#D4B572]/10 p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[#D4B572]/60">Titular</p>
                        <p className="text-[#D4B572]">{bankInfo.accountHolder}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#D4B572]/60">RUT</p>
                        <p className="text-[#D4B572]">{bankInfo.rut}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#D4B572]/60">Banco</p>
                        <p className="text-[#D4B572]">{bankInfo.bank}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#D4B572]/60">Tipo de Cuenta</p>
                        <p className="text-[#D4B572]">{bankInfo.accountType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#D4B572]/60">Número de Cuenta</p>
                        <p className="text-[#D4B572]">{bankInfo.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#D4B572]/60">Email</p>
                        <p className="text-[#D4B572]">{bankInfo.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleCopyAll}
                      className="bg-[#D4B572] hover:bg-[#C4A562] text-[#1C2127] px-8 py-3"
                      leftIcon={copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    >
                      {copied ? 'Copiado' : 'Copiar Datos'}
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