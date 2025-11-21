import React from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { NOTE_COLORS } from '../../constants/colors';

export default function NoteForm({ formData, setFormData, onSubmit, onCancel, isEditing }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        autoFocus
      />
      
      <Textarea
        placeholder="Write your note here..."
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={6}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="flex gap-2">
          {NOTE_COLORS.map((color) => (
            <button
              key={color.bg}
              type="button"
              onClick={() => setFormData({ ...formData, color: color.bg })}
              className={`w-10 h-10 rounded-lg border-2 transition-all ${color.bg} ${
                formData.color === color.bg 
                  ? 'border-indigo-600 scale-110' 
                  : 'border-gray-300'
              }`}
              title={color.name}
            />
          ))}
        </div>
      </div>
      
      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!formData.title.trim() && !formData.description.trim()}
        >
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
