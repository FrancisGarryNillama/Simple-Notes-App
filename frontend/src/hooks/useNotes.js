import { useState, useEffect } from "react";
import {
  getNotesByFolder,
  createNote,
  updateNote,
  deleteNote,
} from "../services/api/notesApi";

export default function useNotes(folderId) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotes = async () => {
    if (!folderId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const data = await getNotesByFolder(folderId);
      setNotes(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Failed to load notes:", err);
      setError("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [folderId]);

  const addNote = async (note) => {
    try {
      const saved = await createNote({
        ...note,
        folderId: Number(folderId),
      });
      setNotes((prev) => [...prev, saved]);
      setError("");
    } catch (err) {
      console.error("Failed to create note:", err);
      setError("Failed to create note. Please try again.");
      throw err;
    }
  };

  const editNote = async (id, updated) => {
    try {
      const saved = await updateNote(id, {
        ...updated,
        folderId: Number(folderId),
      });
      setNotes((prev) => prev.map((n) => (n.id === id ? saved : n)));
      setError("");
    } catch (err) {
      console.error("Failed to update note:", err);
      setError("Failed to update note. Please try again.");
      throw err;
    }
  };

  const removeNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setError("");
    } catch (err) {
      console.error("Failed to delete note:", err);
      setError("Failed to delete note. Please try again.");
      throw err;
    }
  };

  return { 
    notes, 
    isLoading, 
    error, 
    setError, 
    addNote, 
    editNote, 
    removeNote,
    reloadNotes: loadNotes,
  };
}