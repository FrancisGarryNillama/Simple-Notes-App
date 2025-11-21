import React from 'react';
import { Folder, Trash2 } from 'lucide-react';

export default function FolderCard({ folder, onDelete, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-500 hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
            <Folder className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{folder.name}</h3>
            <p className="text-sm text-gray-500">Folder</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(folder.id);
          }}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Delete folder"
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </div>
    </div>
  );
}