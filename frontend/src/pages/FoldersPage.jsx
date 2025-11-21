import React, { useState } from "react";
import { FolderPlus, Folder, Plus } from "lucide-react";
import useFolders from "../hooks/useFolders";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorAlert from "../components/ui/ErrorAlert";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import FolderCard from "../components/folders/FolderCard";
import FolderForm from "../components/folders/FolderForm";

export default function FoldersPage({ onSelectFolder }) {
  const { folders, loading, error, setError, addFolder, removeFolder } = useFolders();
  const [isModalOpen, setModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    try {
      await addFolder(folderName);
      setFolderName("");
      setModalOpen(false);
    } catch (err) {
      // Error already handled in hook
    }
  };

  const handleDeleteFolder = async (id) => {
    if (window.confirm("Are you sure you want to delete this folder? All notes inside will be lost.")) {
      try {
        await removeFolder(id);
      } catch (err) {
        // Error already handled in hook
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <ErrorAlert message={error} onClose={() => setError("")} />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Folders</h1>
              <p className="text-gray-600 mt-1">Organize your notes into folders</p>
            </div>
            <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
              <FolderPlus className="w-5 h-5" />
              New Folder
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {folders.length === 0 ? (
          <div className="text-center py-16">
            <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No folders yet</h3>
            <p className="text-gray-500 mb-6">Create your first folder to start organizing</p>
            <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2 mx-auto">
              <Plus className="w-5 h-5" />
              Create Folder
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onDelete={handleDeleteFolder}
                onClick={() => onSelectFolder(folder.id, folder.name)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Folder Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create New Folder">
        <FolderForm
          folderName={folderName}
          setFolderName={setFolderName}
          onSubmit={handleCreateFolder}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
