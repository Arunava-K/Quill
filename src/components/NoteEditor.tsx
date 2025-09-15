import { useState, useEffect } from "react";
import { Note } from "../types";

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (id: number, title: string, content: string) => void;
}

export default function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsEditing(false);
    }
  }, [note]);

  const handleSave = () => {
    if (note && (title !== note.title || content !== note.content)) {
      onUpdateNote(note.id, title, content);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">Ready to write?</h3>
          <p className="text-neutral-500 leading-relaxed mb-4">
            Select a note from the sidebar to start editing, or create a new note to capture your thoughts.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Your ideas await
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 bg-white/80 backdrop-blur-sm border-b border-primary-100/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 mr-4">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsEditing(true);
              }}
              onKeyDown={handleKeyDown}
              className="text-2xl font-bold text-neutral-800 bg-transparent border-none outline-none w-full placeholder-neutral-400 focus:placeholder-neutral-300 transition-colors"
              placeholder="Untitled note..."
            />
          </div>
          {isEditing && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl hover:from-accent-600 hover:to-accent-700 transition-all duration-200 text-sm font-medium shadow-soft hover:shadow-medium transform hover:scale-105 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-neutral-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last updated: {new Date(note.updated_at).toLocaleString()}
            </div>
            {isEditing && (
              <div className="flex items-center text-primary-500 animate-pulse">
                <div className="w-2 h-2 bg-primary-400 rounded-full mr-2"></div>
                Unsaved changes
              </div>
            )}
          </div>
          <div className="flex items-center text-neutral-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
            </svg>
            Ctrl+S to save
          </div>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 p-6 bg-white/40 backdrop-blur-xs">
        <div className="h-full bg-white/60 rounded-2xl p-6 shadow-soft border border-white/50">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsEditing(true);
            }}
            onKeyDown={handleKeyDown}
            className="w-full h-full resize-none border-none outline-none text-neutral-700 leading-relaxed text-base placeholder-neutral-400 bg-transparent focus:placeholder-neutral-300 transition-colors"
            placeholder="Start writing your thoughts here..."
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />
        </div>
      </div>
    </div>
  );
}
