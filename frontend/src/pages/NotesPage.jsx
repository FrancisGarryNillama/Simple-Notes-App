import React, { useState, useMemo } from "react";
import { Search, Plus, ArrowLeft, Grid, List } from "lucide-react";
import useNotes from "../hooks/useNotes";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorAlert from "../components/ui/ErrorAlert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import NoteCard from "../components/notes/NoteCard";
import NoteForm from "../components/notes/NoteForm";
import { NOTE_COLORS } from "../constants/colors";
import { searchFilter } from "../utils/helpers";

export default function NotesPage({ folderId, folderName, onBack }) {
  const { notes, isLoading, error, setError, addNote, editNote, removeNote } = useNotes(folderId);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: NOTE_COLORS[0].bg,
  });

  const filteredNotes = useMemo(() => {
    return searchFilter(notes, searchTerm, ["title", "description"]);
  }, [notes, searchTerm]);

  const openModal = (note = null) => {
    if (note) {
      setEditingNote(note);
      setFormData({
        title: note.title || "",
        description: note.description || "",
        color: note.color || NOTE_COLORS[0].bg,
      });
    } else {
      setEditingNote(null);
      setFormData({ title: "", description: "", color: NOTE_COLORS[0].bg });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingNote(null);
    setFormData({ title: "", description: "", color: NOTE_COLORS[0].bg });
  };

  const handleSave = async () => {
    if (!formData.title.trim() && !formData.description.trim()) return;
    
    try {
      if (editingNote) {
        await editNote(editingNote.id, formData);
      } else {
        await addNote(formData);
      }
      closeModal();
    } catch (err) {
      // Error already handled in hook
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await removeNote(id);
      } catch (err) {
        // Error already handled in hook
      }
    }
  };

  if (isLoading && notes.length === 0) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <ErrorAlert message={error} onClose={() => setError("")} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Back to folders"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{folderName || "Notes"}</h1>
                <p className="text-gray-600 mt-1">{notes.length} notes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                  }`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              <Button onClick={() => openModal()} className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? "No notes found" : "No notes yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "Try a different search term" : "Create your first note to get started"}
            </p>
            {!searchTerm && (
              <Button onClick={() => openModal()} className="flex items-center gap-2 mx-auto">
                <Plus className="w-5 h-5" />
                Create Note
              </Button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openModal}
                onDelete={handleDeleteNote}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </main>

      {/* Note Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingNote ? "Edit Note" : "Create Note"}
      >
        <NoteForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSave}
          onCancel={closeModal}
          isEditing={!!editingNote}
        />
      </Modal>
    </div>
  );
}
