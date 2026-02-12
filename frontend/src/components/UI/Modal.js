import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ show, onClose, title, children, size = "max-w-2xl" }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-black/30" 
        onClick={onClose}
      />
      <div className={`relative ${size} w-full glass-strong rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 glass rounded-t-3xl border-b border-white/20 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white text-shadow">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6 text-gray-300" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;