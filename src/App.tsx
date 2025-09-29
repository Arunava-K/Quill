import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Note } from "./types";
import NoteEditor from "./components/NoteEditor";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import FloatingActionButton from "./components/FloatingActionButton";
import SidebarToggle from "./components/SidebarToggle";
import HomePage from "./pages/HomePage";

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
          <div className="flex-1 flex flex-col">
            {/* Header with toggle button */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--color-neutral-300)' }}>
              <div className="flex items-center space-x-4">
                <SidebarToggle onToggle={toggleSidebarCollapse} />
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Starred Notes
                </h2>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-700 mb-2">Starred Notes</h3>
                <p className="text-neutral-500">Your favorite notes will appear here</p>
              </div>
            </div>
          </div>
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
  );
}

export default App;