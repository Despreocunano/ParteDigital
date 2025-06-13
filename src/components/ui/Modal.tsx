import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = false,
  isLoading = false,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />

        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[90vw]">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-4">
            {children}
          </div>

          {/* Footer */}
          {onConfirm && (
            <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3">
              <Button
                onClick={onConfirm}
                variant={isDanger ? 'danger' : 'primary'}
                isLoading={isLoading}
                className='bg-primary hover:bg-primary-dark text-primary-contrast'
              >
                {confirmText}
              </Button>
              <Button
                onClick={onClose}
                variant="secondary"
                disabled={isLoading}
                className='border border-primary text-primary hover:bg-primary-dark hover:text-primary-contrast'
              >
                {cancelText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}