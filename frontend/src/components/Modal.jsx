import React from 'react';

const Modal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center not-last:bg-transparent backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4">{title || ''}</h2>

        <div>{children}</div>

        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Modal;
