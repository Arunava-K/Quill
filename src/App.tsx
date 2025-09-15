import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Note } from "./types";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const fetchedNotes = await invoke<Note[]>("get_notes");
      setNotes(fetchedNotes);
      if (fetchedNotes.length > 0 && !selectedNote) {
        setSelectedNote(fetchedNotes[0]);
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    try {
      const newNote = await invoke<Note>("add_note", {
        title: "New Note",
        content: "",
      });
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const updateNote = async (id: number, title: string, content: string) => {
    try {
      const updatedNote = await invoke<Note>("update_note", {
        id,
        title,
        content,
      });
      setNotes(notes.map(note => note.id === id ? updatedNote : note));
      setSelectedNote(updatedNote);
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      await invoke("delete_note", { id });
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      if (selectedNote?.id === id) {
        setSelectedNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-neutral-700">Loading your notes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-primary-100 flex flex-col shadow-soft">
        <div className="p-6 border-b border-primary-100/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Quill
              </h1>
            </div>
            <button
              onClick={createNote}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 text-sm font-medium shadow-soft hover:shadow-medium transform hover:scale-105"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </button>
          </div>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Capture your thoughts and ideas in beautiful, organized notes
          </p>
        </div>
        <NotesList
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={setSelectedNote}
          onDeleteNote={deleteNote}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-white/60 backdrop-blur-sm">
        <NoteEditor
          note={selectedNote}
          onUpdateNote={updateNote}
        />
      </div>
    </div>
  );
}

export default App;