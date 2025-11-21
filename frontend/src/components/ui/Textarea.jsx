import React from 'react';

export default function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${className}`}
      {...props}
    />
  );
}