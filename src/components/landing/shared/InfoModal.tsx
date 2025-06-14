import { X, LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  overlayColor?: string;
  children: ReactNode;
}

export function InfoModal({
  isOpen,
  onClose,
  title,
  icon: Icon,
  iconColor = '#D4B572',
  overlayColor = '#1C2127',
  children
}: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4 overflow-y-auto`}
        style={{ backgroundColor: `${overlayColor}95` }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl px-8 py-12 text-center bg-white rounded-lg shadow-xl my-8"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="space-y-8">
            <div className="relative -mt-[100px] mb-8">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                <Icon className="w-12 h-12" style={{ color: iconColor }} />
              </div>
            </div>
            <h2 className="text-2xl font-serif text-gray-900">{title}</h2>
            <div className="overflow-x-auto">
              {children}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 