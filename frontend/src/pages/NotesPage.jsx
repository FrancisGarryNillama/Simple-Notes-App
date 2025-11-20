import { useState, useMemo } from "react";
import { NoteCard, ErrorModal, Loading } from "../components";
import useNotes from "../hooks/useNotes";
import { Search } from "lucide-react";

const NOTE_COLORS = [
  "bg-red-200",
  "bg-green-200",
  "bg-blue-200",
  "bg-yellow-200",
  "bg-purple-200",
];

export default function NotesPage() {
  const { notes, addNote, editNote, removeNote, error, setError, isLoading } = useNotes();

  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState(NOTE_COLORS[0]);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const filteredNotes = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => (n.title || "").toLowerCase().includes(q));
  }, [notes, searchTerm]);

  if (isLoading && notes.length === 0) {
    return <Loading />;
  }

  // Handlers
  const resetForm = () => {
    setTitle("");
    setContent("");
    setColor(NOTE_COLORS[0]);
    setEditingNoteId(null);
  };

  const saveNote = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const noteData = { title, description: content, color };

    if (editingNoteId) {
      await editNote(editingNoteId, noteData);
    } else {
      await addNote(noteData);
    }

    resetForm();
  };

  const editNoteHandler = (note) => {
    setEditingNoteId(note.id);
    setTitle(note.title || "");
    setContent(note.description || "");
    setColor(note.color || NOTE_COLORS[0]);
  };

  const deleteNoteHandler = async (id) => {
    await removeNote(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <ErrorModal
        show={Boolean(error)}
        message={error}
        onClose={() => setError("")}
      />

      <header className="bg-white shadow-md sticky top-0 z-10 p-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight">
            TDWB - Notes
          </h1>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search notes by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <form
          onSubmit={saveNote}
          className="bg-white p-6 rounded-xl shadow-xl mb-10 border-t-4 border-indigo-500"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {editingNoteId ? "Edit Note" : "Add New Note"}
          </h2>

          <input
            type="text"
            placeholder="Title (Optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-semibold p-3 mb-4 border-b-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition rounded-t-lg"
            aria-label="Note Title"
          />

          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-y focus:outline-none transition"
            aria-label="Note Content"
          ></textarea>

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-2">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${c} shadow-md border-2 transition transform hover:scale-110 ${
                    color === c ? "border-indigo-600 ring-2 ring-indigo-300" : "border-white"
                  }`}
                  title={`Select ${c.split("-")[1]} color`}
                />
              ))}
            </div>

            <div className="flex space-x-3">
              {editingNoteId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-150"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                disabled={!editingNoteId && !title.trim() && !content.trim()}
                className={`px-6 py-2 text-white font-bold rounded-lg shadow-lg transition duration-150 transform ${
                  !editingNoteId && !title.trim() && !content.trim()
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.03]"
                }`}
              >
                {editingNoteId ? "Update Note" : "Save Note"}
              </button>
            </div>
          </div>
        </form>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          {searchTerm ? `Search Results (${filteredNotes.length})` : `Your Notes (${notes.length})`}
        </h2>

        {filteredNotes.length === 0 && (
          <div className="text-center p-10 bg-white rounded-xl shadow-inner text-gray-500">
            <p className="text-lg">
              {searchTerm ? "We couldn’t find any notes matching that title." : "It looks like you haven’t created a note yet. Start by typing above!"}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={editNoteHandler} onDelete={deleteNoteHandler} />
          ))}
        </div>
      </main>
    </div>
  );
}
