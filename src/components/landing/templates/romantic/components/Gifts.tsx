import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { Modal } from '../../../../ui/Modal';

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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Datos Bancarios"
      >
        <div className="space-y-4">
          {bankInfo ? (
            <div className="space-y-3">
              <div className="p-4 bg-[#1C2127] rounded-lg border border-[#D4B572]/20">
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
              <p className="text-sm text-center text-[#D4B572]/80">
                Guarda una captura de pantalla o copia estos datos para realizar tu regalo
              </p>
            </div>
          ) : (
            <p className="text-center text-[#D4B572]/80">
              Pronto encontrarás aquí la información bancaria para realizar tu regalo.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}