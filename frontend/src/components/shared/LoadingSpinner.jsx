import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-lg font-semibold text-gray-700">Loading...</p>
      <p className="text-sm text-gray-500 mt-2">Fetching your data</p>
    </div>
  );
}