import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Note } from "../types";
import NoteCard from "../components/NoteCard";
import QuickStats from "../components/QuickStats";
import RecentNotes from "../components/RecentNotes";
import SidebarToggle from "../components/SidebarToggle";

interface HomePageProps {
  onCreateNote: () => void;
  onSelectNote: (note: Note) => void;
  onToggleSidebar?: () => void;
}

export default function HomePage({ onCreateNote, onSelectNote, onToggleSidebar }: HomePageProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const fetchedNotes = await invoke<Note[]>("get_notes");
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get recent notes (last 6)
  const recentNotes = notes
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 6);

  // Group notes by date for the main content
  const groupedNotes = notes.reduce((groups: { [key: string]: Note[] }, note) => {
    const date = new Date(note.updated_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(note);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-neutral-700">Loading your workspace...</div>
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
                <h1 
                  className="text-3xl font-bold mb-1"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}! 👋
                </h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  {notes.length === 0 
                    ? "Ready to capture your first thought?" 
                    : `You have ${notes.length} note${notes.length === 1 ? '' : 's'} in your workspace`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onCreateNote}
              className="px-6 py-3 text-white rounded-2xl transition-all duration-200 font-medium shadow-soft hover:shadow-medium transform hover:scale-105 flex items-center"
              style={{ backgroundColor: 'var(--color-text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-neutral-800)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-text-primary)';
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* Quick Stats */}
        <QuickStats notes={notes} />

        {/* Recent Notes Section */}
        {recentNotes.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-xl font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Recent Notes
              </h2>
              <button 
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                View all →
              </button>
            </div>
            <RecentNotes notes={recentNotes} onSelectNote={onSelectNote} />
          </section>
        )}

        {/* All Notes by Date */}
        {Object.keys(groupedNotes).length > 0 ? (
          <section>
            <h2 
              className="text-xl font-semibold mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              All Notes
            </h2>
            <div className="space-y-8">
              {Object.entries(groupedNotes)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([date, dateNotes]) => (
                  <div key={date} className="space-y-4">
                    {/* Date Header */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 
                          className="text-lg font-medium"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {date}
                        </h3>
                      </div>
                      <div 
                        className="flex-1 h-px bg-gradient-to-r to-transparent"
                        style={{ 
                          backgroundImage: `linear-gradient(to right, var(--color-neutral-300), transparent)` 
                        }}
                      ></div>
                    </div>

                    {/* Notes Grid */}
                    <div className="flex flex-wrap gap-6">
                      {dateNotes.map((note) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          onClick={() => onSelectNote(note)}
                          className="flex-1 min-w-[300px] max-w-[calc(33.333%-16px)]"
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-neutral-700 mb-3">Welcome to Quill!</h3>
            <p className="text-neutral-500 leading-relaxed mb-6 max-w-md">
              Your digital workspace is ready. Start capturing your thoughts, ideas, and inspirations with your first note.
            </p>
            <button
              onClick={onCreateNote}
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-medium shadow-soft hover:shadow-medium transform hover:scale-105 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
