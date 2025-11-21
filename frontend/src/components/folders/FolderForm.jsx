import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function FolderForm({ folderName, setFolderName, onSubmit, onCancel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Folder name"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
        autoFocus
      />
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!folderName.trim()}>
          Create
        </Button>
      </div>
    </form>
  );
}