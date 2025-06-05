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
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-8 h-8 text-rose-600" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-gray-900">Mesa de Regalos</h2>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Tu presencia es nuestro mejor regalo. Sin embargo, si deseas hacernos un obsequio, aquí tienes la información necesaria.
          </p>
          
          <button
            onClick={() => setShowModal(true)}
            className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 max-w-md mx-auto w-full hover:bg-gray-50 transition-colors duration-200"
          >
            <h3 className="text-xl font-serif mb-2 text-gray-900">Ver Datos Bancarios</h3>
            <p className="text-gray-500 text-sm">
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
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Titular</p>
                    <p className="text-gray-900">{bankInfo.accountHolder}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">RUT</p>
                    <p className="text-gray-900">{bankInfo.rut}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Banco</p>
                    <p className="text-gray-900">{bankInfo.bank}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo de Cuenta</p>
                    <p className="text-gray-900">{bankInfo.accountType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Número de Cuenta</p>
                    <p className="text-gray-900">{bankInfo.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{bankInfo.email}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-center text-gray-500">
                Guarda una captura de pantalla o copia estos datos para realizar tu regalo
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Pronto encontrarás aquí la información bancaria para realizar tu regalo.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}