import React from 'react';
import { X } from 'lucide-react';

export default function ErrorAlert({ message, onClose }) {
  if (!message) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg max-w-md">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{message}</p>
          </div>
          <button onClick={onClose} className="ml-4 text-red-500 hover:text-red-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
