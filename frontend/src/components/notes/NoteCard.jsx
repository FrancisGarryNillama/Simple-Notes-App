import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { NOTE_COLORS } from '../../constants/colors';

export default function NoteCard({ note, onEdit, onDelete, viewMode = 'grid' }) {
  const colorScheme = NOTE_COLORS.find(c => c.bg === note.color) || NOTE_COLORS[0];
  
  if (viewMode === 'list') {
    return (
      <div className={`${colorScheme.bg} border ${colorScheme.border} rounded-xl p-4 ${colorScheme.hover} transition-all duration-200`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {note.title || 'Untitled'}
            </h3>
            <p className="text-gray-600 mt-1 text-sm line-clamp-2">
              {note.description}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(note)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              aria-label="Edit note"
            >
              <Edit2 className="w-4 h-4 text-indigo-600" />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              aria-label="Delete note"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${colorScheme.bg} border ${colorScheme.border} rounded-xl p-5 ${colorScheme.hover} transition-all duration-200 shadow-sm hover:shadow-md group`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1">
          {note.title || 'Untitled'}
        </h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Edit note"
          >
            <Edit2 className="w-4 h-4 text-indigo-600" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Delete note"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
      <p className="text-gray-700 text-sm whitespace-pre-wrap line-clamp-6">
        {note.description}
      </p>
    </div>
  );
}
