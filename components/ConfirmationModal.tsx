import React, { useEffect } from 'react';
import ActionButton from './ActionButton';
import { AlertTriangleIcon } from './Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel' }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
                <AlertTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-grow">
                 <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                 <p className="text-sm text-slate-500 mt-2">{message}</p>
            </div>
        </div>
        
        <div className="flex justify-end items-center gap-4 mt-4">
          <ActionButton variant="secondary" onClick={onClose}>
            {cancelText}
          </ActionButton>
          <ActionButton variant="danger" onClick={handleConfirm}>
            {confirmText}
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
