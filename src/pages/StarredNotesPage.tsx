import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Note } from "../types";
import NoteCard from "../components/NoteCard";
import SidebarToggle from "../components/SidebarToggle";

interface StarredNotesPageProps {
  onSelectNote: (note: Note) => void;
  onToggleSidebar?: () => void;
}

export default function StarredNotesPage({ onSelectNote, onToggleSidebar }: StarredNotesPageProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStarredNotes();
  }, []);

  const loadStarredNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await invoke<Note[]>("get_notes");
      // Filter starred notes on the frontend
      const starredNotes = fetchedNotes.filter(note => note.is_starred);
      setNotes(starredNotes);
    } catch (error) {
      console.error("Failed to load starred notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStarToggle = (updatedNote: Note) => {
    if (!updatedNote.is_starred) {
      // Remove from starred list if unstarred
      setNotes(notes.filter(note => note.id !== updatedNote.id));
    } else {
      // Update the note in the list
      setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-neutral-700">Loading starred notes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div 
        className="sticky top-0 z-10 backdrop-blur-sm border-b flex-shrink-0"
        style={{ 
          backgroundColor: 'rgba(245, 244, 241, 0.8)',
          borderColor: 'var(--color-neutral-300)'
        }}
      >
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              {/* Sidebar Toggle Button */}
              {onToggleSidebar && (
                <SidebarToggle onToggle={onToggleSidebar} />
              )}
              
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h1 
                    className="text-3xl font-bold"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Starred Notes
                  </h1>
                </div>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  {notes.length === 0 
                    ? "No starred notes yet. Star your favorite notes to see them here!" 
                    : `${notes.length} starred note${notes.length === 1 ? '' : 's'}`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {notes.length > 0 ? (
          <section>
            <h2 
              className="text-xl font-semibold mb-6 flex items-center"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Your Favorites
            </h2>
            
            {/* Notes Grid */}
            <div className="flex flex-wrap gap-6">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => onSelectNote(note)}
                  onStarToggle={handleStarToggle}
                  className="flex-1 min-w-[300px] max-w-[calc(33.333%-16px)]"
                />
              ))}
            </div>
          </section>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-3xl flex items-center justify-center">
              <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-neutral-700 mb-3">No Starred Notes Yet</h3>
            <p className="text-neutral-500 leading-relaxed mb-6 max-w-md">
              Star your favorite or important notes to quickly access them here. Click the star icon on any note card to add it to your favorites.
            </p>
            <div className="flex items-center space-x-2 text-sm text-neutral-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tip: Hover over any note to see the star button</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

