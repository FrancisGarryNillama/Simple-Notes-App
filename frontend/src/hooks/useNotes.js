// src/hooks/useNotes.js
import { useState, useEffect } from "react";
import { getAllNotes, createNote, updateNote, deleteNote } from "../services/notesApi";

export default function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load notes from API
  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await getAllNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new note
  const addNote = async (note) => {
    setLoading(true);
    try {
      const saved = await createNote(note);
      setNotes((prev) => [...prev, saved]);
    } catch (err) {
      console.error(err);
      setError("Failed to save note.");
    } finally {
      setLoading(false);
    }
  };

  // Edit an existing note
  const editNote = async (id, updatedNote) => {
    setLoading(true);
    try {
      const saved = await updateNote(id, updatedNote);
      setNotes((prev) => prev.map((n) => (n.id === id ? saved : n)));
    } catch (err) {
      console.error(err);
      setError("Failed to update note.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a note
  const removeNote = async (id) => {
    setLoading(true);
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete note.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch notes once on mount
  useEffect(() => {
    const fetchNotes = async () => {
      await loadNotes();
    };
    fetchNotes();
  }, []);

  return { notes, loading, error, setError, addNote, editNote, removeNote };
}
