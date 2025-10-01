import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Note } from "./types";
import NoteEditor from "./components/NoteEditor";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import FloatingActionButton from "./components/FloatingActionButton";
import HomePage from "./pages/HomePage";
import StarredNotesPage from "./pages/StarredNotesPage";
import { DragAndDropProvider } from "./contexts/DragAndDropContext";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null | undefined>(undefined);

  const handleFolderSelect = (folderId: number | null | undefined) => {
    setSelectedFolderId(folderId);
    // Only switch to home view if a folder is selected (not when resetting to undefined)
    if (folderId !== undefined) {
      setCurrentView('home');
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle sidebar with Cmd/Ctrl + B
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        // On desktop, toggle collapse; on mobile, toggle open/close
        if (window.innerWidth >= 1024) {
          setSidebarCollapsed(prev => !prev);
        } else {
          setSidebarOpen(prev => !prev);
        }
      }
      // Close sidebar with Escape
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

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
        folderId: selectedFolderId,
      });
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
      setCurrentView('editor'); // Switch to editor view when creating a note
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setCurrentView('editor'); // Switch to editor view when selecting a note
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(prev => !prev);
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

  const handleNoteDrop = async (noteId: number, folderId: number | null) => {
    try {
      const updatedNote = await invoke<Note>("move_note_to_folder", {
        noteId,
        folderId,
      });
      // Update the notes list with the updated note
      setNotes(notes.map(note => note.id === noteId ? updatedNote : note));
      // If the currently selected note was updated, update it too
      if (selectedNote?.id === noteId) {
        setSelectedNote(updatedNote);
      }
    } catch (error) {
      console.error("Failed to move note to folder:", error);
      alert("Failed to move note. Please try again.");
    }
  };

  const handleStarToggle = (updatedNote: Note) => {
    // Update the notes list with the updated note
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    // If the currently selected note was updated, update it too
    if (selectedNote?.id === updatedNote.id) {
      setSelectedNote(updatedNote);
    }
  };

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="text-center">
          <div 
            className="w-12 h-12 mx-auto mb-4 border-4 rounded-full animate-spin"
            style={{ 
              borderColor: 'var(--color-neutral-300)',
              borderTopColor: 'var(--color-text-primary)'
            }}
          ></div>
          <div 
            className="text-lg font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Loading your notes...
          </div>
        </div>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            onCreateNote={createNote}
            onSelectNote={handleSelectNote}
            onToggleSidebar={toggleSidebarCollapse}
            selectedFolderId={selectedFolderId}
            onStarToggle={handleStarToggle}
          />
        );
      case 'editor':
        return (
          <div className="flex-1">
            <NoteEditor
              note={selectedNote}
              onUpdateNote={updateNote}
              onToggleSidebar={toggleSidebarCollapse}
            />
          </div>
        );
      case 'starred':
        return (
          <StarredNotesPage
            onSelectNote={handleSelectNote}
            onToggleSidebar={toggleSidebarCollapse}
          />
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">Coming Soon</h3>
              <p className="text-neutral-500">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <DragAndDropProvider onNoteDrop={handleNoteDrop}>
      <div className="h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
        {/* Mobile Header */}
        <Header 
          onToggleSidebar={toggleSidebar}
          currentView={currentView}
        />
        
        {/* Card Layout Container */}
        <div className={`h-full lg:h-screen p-3 flex layout-container ${sidebarCollapsed ? 'gap-0' : 'gap-3 lg:gap-3'}`}>
          {/* Floating Sidebar with Animation */}
          <div className={`sidebar-container ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
            <Sidebar
              currentView={currentView}
              onViewChange={setCurrentView}
              onCreateNote={createNote}
              isOpen={sidebarOpen}
              onToggle={toggleSidebar}
              selectedFolderId={selectedFolderId}
              onSelectFolder={handleFolderSelect}
            />
          </div>
          
          {/* Main Content Card with Animation */}
          <div 
            className={`backdrop-blur-sm rounded-18 shadow-soft overflow-y-auto main-content ${
              sidebarCollapsed ? 'main-content-expanded' : ''
            }`}
            style={{ 
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-neutral-300)'
            }}
          >
            {renderMainContent()}
          </div>
        </div>
        
        {/* Floating Action Button for Mobile */}
        <FloatingActionButton onClick={createNote} />
      </div>
    </DragAndDropProvider>
  );
}

export default App;