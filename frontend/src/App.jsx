import React, { useState, useEffect } from 'react';

// --- CONFIGURATION ---
// Base URL for your Spring Boot Application
const API_BASE_URL = 'http://localhost:8080/api/notes'; 

// Extract global variables
const appId = typeof window !== 'undefined' && typeof window.__app_id !== 'undefined' 
    ? window.__app_id 
    : 'default-notes-app';

// The required DEFAULT_FOLDER_ID, now defined using the appId for uniqueness
// perform user-level authentication based on the user ID, which is now client-side only.
const DEFAULT_FOLDER_ID_CONSTANT = `folder-${appId}`;

// Lucide React Icons
const Search = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const Trash2 = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const Pin = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5"/><path d="M17 12l-5-5-5 5h10z"/><path d="M12 2v10"/></svg>;
const Pencil = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const X = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;


// Color Selections
const NOTE_COLORS = [
    'bg-yellow-100', // Default
    'bg-blue-100',
    'bg-green-100',
    'bg-pink-100',
    'bg-purple-100',
    'bg-gray-200',
];

// --- Custom Components ---

// Error Message Modal
const ErrorModal = ({ show, message, onClose }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pointer-events-none">
            <div className="bg-red-600 text-white p-4 rounded-xl shadow-2xl transition-opacity duration-300 pointer-events-auto max-w-sm w-full mx-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <X className="w-5 h-5 mr-2" />
                        <span className="font-semibold text-sm">{message}</span>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full hover:bg-red-700 transition"
                        aria-label="Close error message"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Note Card Component
const NoteCard = ({ note, onEdit, onDelete, onTogglePin }) => {
    // Date Format: "2000-01-01 T10:00:00"
    const formattedDate = note.lastSaved 
        ? new Date(note.lastSaved).toLocaleDateString() 
        : 'N/A';

    // Pin Icon State
    const pinClasses = note.isPinned ? 'text-indigo-600 fill-indigo-600' : 'text-gray-400 hover:text-indigo-600 hover:fill-indigo-600/50';

    return (
        <div className={`
            ${note.color} p-5 rounded-xl shadow-lg 
            flex flex-col justify-between 
            transform transition duration-300 hover:shadow-xl hover:scale-[1.02]
            ${note.isPinned ? 'ring-4 ring-indigo-400/70' : 'ring-1 ring-gray-200'}
        `}>
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 break-all leading-snug">
                    {note.title || '(No Title)'}
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap mb-4 text-sm break-all line-clamp-6">
                    {note.content}
                </p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-300/50">
                {/* Display Saved Date */}
                <span className="text-xs text-gray-600 font-medium">
                    Saved: {formattedDate}
                </span>
                <div className="flex space-x-2">
                    {/* Pin/Reorder Icon */}
                    <button
                        onClick={() => onTogglePin(note)}
                        className={`p-1 rounded-full transition ${pinClasses}`}
                        title={note.isPinned ? "Unpin Note (Order)" : "Pin Note (Order)"}
                    >
                        <Pin className="w-5 h-5" />
                    </button>
                    {/* Edit Icon */}
                    <button
                        onClick={() => onEdit(note)}
                        className="p-1 rounded-full text-indigo-500 hover:bg-white/50 transition"
                        title="Edit Note"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    {/* Delete Icon */}
                    <button
                        onClick={() => onDelete(note.id)}
                        className="p-1 rounded-full text-red-500 hover:bg-white/50 transition"
                        title="Delete Note"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---

const App = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState(NOTE_COLORS[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // --- NEW: Authentication and User ID State (Simplified for No-Auth) ---
    // userId is now a persistent, anonymous ID from localStorage
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    
    // State to hold client-side preferences (color, pinned status) from localStorage
    const [localNotePrefs, setLocalNotePrefs] = useState({});

    // Custom Error Message Display
    const displayError = (message, title = "Operation Failed") => {
        console.error(`${title}: ${message}`);
        setErrorMessage(message);
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 5000); // Auto-hide after 5s
    };

    // --- 1. USER ID SETUP EFFECT (NO AUTH) ---
    // Generates a persistent, anonymous ID for client-side storage segregation.
    useEffect(() => {
        const LOCAL_USER_ID_KEY = `tdwb-anonymous-user-id-${appId}`;
        let currentUserId = localStorage.getItem(LOCAL_USER_ID_KEY);

        if (!currentUserId) {
            // Use crypto.randomUUID() for a unique identifier
            currentUserId = crypto.randomUUID();
            localStorage.setItem(LOCAL_USER_ID_KEY, currentUserId);
        }

        setUserId(currentUserId);
        setIsAuthReady(true); // Always ready since no external auth is needed

        console.log("Running in No-Auth mode. Anonymous User ID:", currentUserId);
    }, []); // Run only once on mount

    // --- Local Storage Key ---
    // Make this dynamic, as userId is now state.
    const getLocalStorageKey = (id) => `tdwb-notes-prefs-${id}`;

    // --- 2. Local Storage Functions for UI Preferences ---

    // Load preferences from localStorage on mount/userId change
    useEffect(() => {
        if (!userId) return; // Wait for userId to be set
        const LOCAL_STORAGE_KEY = getLocalStorageKey(userId);
        try {
            const storedPrefs = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedPrefs) {
                setLocalNotePrefs(JSON.parse(storedPrefs));
            }
        } catch (e) {
            console.warn("Could not load preferences from localStorage:", e);
        }
    }, [userId]); // Depend on userId being set

    // Function to save preferences to localStorage
    const savePrefsToLocalStorage = (newPrefs) => {
        if (!userId) {
            console.error("Cannot save prefs: userId not defined.");
            return;
        }
        const LOCAL_STORAGE_KEY = getLocalStorageKey(userId);
        setLocalNotePrefs(newPrefs);
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPrefs));
        } catch (e) {
            console.error("Failed to save preferences to localStorage:", e);
        }
    };

    // --- REST API CRUD Functions ---

    // GET: Read All Notes (/api/notes?folderId={id})
    const fetchNotes = async () => {
        if (!isAuthReady || !userId) return; // Ensure client ID is ready
        
        // Show loading spinner only if the notes array is currently empty
        if (notes.length === 0) setIsLoading(true); 

        try {
            // Fetch notes using the now-defined DEFAULT_FOLDER_ID_CONSTANT
            const url = `${API_BASE_URL}?folderId=${DEFAULT_FOLDER_ID_CONSTANT}`;
            const response = await fetch(url);

            if (!response.ok) {
                // Attempt to parse error message if available
                const errorText = await response.text();
                throw new Error(`HTTP status: ${response.status}. Response: ${errorText.substring(0, 100)}...`);
            }

            const apiNotes = await response.json();

            // 1. Combine API data with client-side preferences (color, pinned)
            const combinedNotes = apiNotes.map(note => ({
                ...note,
                // Client-side preferences lookup (persisted in localStorage)
                color: localNotePrefs[note.id]?.color || NOTE_COLORS[0],
                isPinned: localNotePrefs[note.id]?.isPinned || false,
                // 'lastSaved' field from Java Note.java is used for sorting/display
                lastSaved: note.lastSaved, 
            }));

            // 2. Sort client-side: Pinned notes first, then by lastSaved date descending (newest first)
            const sortedNotes = combinedNotes.sort((a, b) => {
                // Parse date strings for comparison
                const dateA = new Date(a.lastSaved);
                const dateB = new Date(b.lastSaved);

                if (a.isPinned !== b.isPinned) {
                    return a.isPinned ? -1 : 1; // Pinned notes come first
                }
                // Sort by lastSaved date descending
                return dateB.getTime() - dateA.getTime();
            });

            setNotes(sortedNotes);

        } catch (e) {
            displayError(`Failed to fetch notes: ${e.message}. Ensure your backend is running and accessible.`, "Network Error");
        } finally {
            setIsLoading(false);
        }
    };

    // --- 3. Note Fetching Effect ---
    // Call fetchNotes when client ID is ready or preferences load
    useEffect(() => {
        // Only fetch notes once the local prefs have been loaded (or initialized) AND client ID is ready
        if (isAuthReady && userId) { 
            fetchNotes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthReady, userId, localNotePrefs]); // Refetch when local prefs change to update view


    // Reset input fields
    const resetForm = () => {
        setTitle('');
        setContent('');
        setColor(NOTE_COLORS[0]);
        setEditingNoteId(null);
    };

    // POST/PUT: Save/Update Note (Create & Update)
    const saveNote = async (e) => {
        e.preventDefault();
        if (!title.trim() && !content.trim()) {
            displayError("Note cannot be empty.");
            return;
        }

        // Payload matches NoteRequest.java DTO
        const noteRequestPayload = {
            folderId: DEFAULT_FOLDER_ID_CONSTANT,
            title: title.trim(),
            content: content.trim(),
        };

        try {
            let response;
            let method;
            let url;

            if (editingNoteId) {
                // Update existing note (PUT /api/notes/{id})
                url = `${API_BASE_URL}/${editingNoteId}`;
                method = 'PUT';
            } else {
                // Add new note (POST /api/notes)
                url = API_BASE_URL;
                method = 'POST';
            }

            response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteRequestPayload),
            });

            if (!response.ok) {
                 const errorText = await response.text();
                 throw new Error(`HTTP status: ${response.status}. Response: ${errorText.substring(0, 100)}...`);
            }
            
            const savedNote = await response.json();
            
            // Client Side
            if (!editingNoteId) {
                // New note: save selected color and default pinned status
                const newPrefs = {
                    ...localNotePrefs,
                    [savedNote.id]: { color: color, isPinned: false }
                };
                savePrefsToLocalStorage(newPrefs);
            } else {
                // Update: ensure the chosen color is persisted for this ID
                const updatedPrefs = {
                    ...localNotePrefs,
                    [editingNoteId]: { 
                        ...localNotePrefs[editingNoteId],
                        color: color // Update color only
                    }
                };
                savePrefsToLocalStorage(updatedPrefs);
            }

            resetForm();
            await fetchNotes(); // Refresh notes to display the change

        } catch (e) {
            displayError(`Failed to save note: ${e.message}`);
        }
    };

    // DELETE: Delete Note (/api/notes/{id})
    const deleteNote = async (id) => {
        try {
            const url = `${API_BASE_URL}/${id}`;
            const response = await fetch(url, { method: 'DELETE' });

            if (!response.ok) {
                 const errorText = await response.text();
                 throw new Error(`HTTP status: ${response.status}. Response: ${errorText.substring(0, 100)}...`);
            }

            // Remove preferences from local storage
            // Note: We use computed property name for deletion, ensure 'id' is safe
            // Change _ to deleted. Temporarily changed to "_" due to errors
            const { [id]: _, ...newPrefs } = localNotePrefs;
            savePrefsToLocalStorage(newPrefs);
            
            // If the deleted note was being edited, clear the form
            if (editingNoteId === id) {
                resetForm();
            }

            await fetchNotes(); // Refresh notes to remove the deleted one

        } catch (e) {
            displayError(`Failed to delete note: ${e.message}`);
        }
    };

    // Edit Note UI setup
    const editNote = (note) => {
        setEditingNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
        // Use the client-side color preference for editing
        setColor(note.color); 
        // Scroll to the input area
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Toggle Pin Status (Client-side Reordering)
    const togglePin = (note) => {
        const newPinnedStatus = !note.isPinned;
        
        // Update client-side preferences in localStorage
        const newPrefs = {
            ...localNotePrefs,
            [note.id]: {
                // Ensure existing color is preserved if it exists, otherwise default
                color: localNotePrefs[note.id]?.color || note.color || NOTE_COLORS[0],
                isPinned: newPinnedStatus,
            }
        };
        
        savePrefsToLocalStorage(newPrefs);
    };

    // Filter notes based on search term (title only)
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Render logic for Loading state
    if (isLoading && notes.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-t-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-xl font-semibold text-indigo-600">Loading TDWB - Notes...</p>
                    <p className="text-sm text-gray-500 mt-1">Fetching notes from Spring Boot API...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <ErrorModal 
                show={showErrorModal} 
                message={errorMessage} 
                onClose={() => setShowErrorModal(false)} 
            />

            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-10 p-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                    <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight">
                        TDWB - Notes
                    </h1>
                    
                    {/* Search Bar */}
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
                
                {/* User ID display (mandatory for multi-user apps) */}
                <div className="text-right mb-4 text-sm text-gray-600 truncate">
                    Anonymous Client ID: <span className="font-mono text-gray-800 bg-gray-100 p-1 rounded-md">{userId || 'N/A'}</span>
                </div>

                {/* First Area: Note Input Form */}
                <form onSubmit={saveNote} className="bg-white p-6 rounded-xl shadow-xl mb-10 border-t-4 border-indigo-500">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingNoteId ? 'Edit Note' : 'Add New Note'}</h2>
                    
                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Title (Optional)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-xl font-semibold p-3 mb-4 border-b-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition rounded-t-lg"
                    />

                    {/* Text Area (Note) */}
                    <textarea
                        placeholder="Write your note here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="6"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-y focus:outline-none transition"
                    ></textarea>

                    {/* Color and Button Area */}
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        
                        {/* Color Picker */}
                        <div className="flex space-x-2">
                            {NOTE_COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full ${c} shadow-md border-2 transition transform hover:scale-110 ${
                                        color === c ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-white'
                                    }`}
                                    title={`Select ${c.split('-')[1]} color`}
                                ></button>
                            ))}
                        </div>

                        {/* Buttons */}
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
                                // Disabled if both title and content are empty, and not currently editing
                                disabled={!editingNoteId && !title.trim() && !content.trim()}
                                className={`px-6 py-2 text-white font-bold rounded-lg shadow-lg transition duration-150 transform ${
                                    (!editingNoteId && !title.trim() && !content.trim())
                                        ? 'bg-indigo-300 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.03]'
                                }`}
                            >
                                {editingNoteId ? 'Update Note' : 'Save Note'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Second Area: Card Preview Type of the Added/Saved Notes */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                    {searchTerm ? `Search Results (${filteredNotes.length})` : `Your Notes (${notes.length})`}
                </h2>

                {filteredNotes.length === 0 && (
                    <div className="text-center p-10 bg-white rounded-xl shadow-inner text-gray-500">
                        <p className="text-lg">
                            {searchTerm 
                                ? "We couldn’t find any notes for that search"
                                : "It looks like you haven’t created a note yet."
                            }
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredNotes.map(note => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onEdit={editNote}
                            onDelete={deleteNote}
                            onTogglePin={togglePin}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default App;