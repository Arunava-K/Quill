import { Note } from "../types";
import { useFolders } from "../hooks/useFolders";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { invoke } from "@tauri-apps/api/core";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  showFolder?: boolean;
  className?: string;
  onStarToggle?: (updatedNote: Note) => void;
}

export default function NoteCard({ note, onClick, showFolder = true, className = "", onStarToggle }: NoteCardProps) {
  const { getFolderById } = useFolders();
  
  // Set up drag functionality
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `note-${note.id}`,
    data: {
      type: "note",
      note: note,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getPreviewText = (content: string) => {
    // Remove any markdown formatting and get first 120 characters
    const cleanText = content
      .replace(/[#*`_~]/g, '') // Remove markdown symbols
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
    
    if (cleanText.length <= 120) return cleanText;
    return cleanText.substring(0, 120) + '...';
  };

  const getWordCount = (content: string) => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleStarToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updatedNote = await invoke<Note>("toggle_note_starred", {
        noteId: note.id,
      });
      onStarToggle?.(updatedNote);
    } catch (error) {
      console.error("Failed to toggle star:", error);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`group relative rounded-2xl p-6 cursor-pointer max-w-96 ${className}`}
      style={{
        backgroundColor: 'var(--color-background)',
        border: '1px solid var(--color-neutral-300)',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.backgroundColor = 'var(--color-neutral-50)';
          e.currentTarget.style.borderColor = 'var(--color-neutral-400)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.backgroundColor = 'var(--color-background)';
          e.currentTarget.style.borderColor = 'var(--color-neutral-300)';
        }
      }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 
              className="font-semibold text-lg leading-tight truncate transition-colors"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {note.title || "Untitled"}
            </h3>
            {showFolder && note.folder_id && (() => {
              const folder = getFolderById(note.folder_id);
              return folder ? (
                <span 
                  className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0"
                  style={{ 
                    backgroundColor: 'var(--color-primary-100)',
                    color: 'var(--color-primary-700)'
                  }}
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  {folder.name}
                </span>
              ) : null;
            })()}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className={`flex items-center space-x-1 transition-opacity ${
          note.is_starred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <button
            onClick={handleStarToggle}
            className={`p-2 rounded-lg transition-all duration-200 ${
              note.is_starred 
                ? 'text-yellow-500 bg-yellow-50' 
                : 'text-neutral-400 hover:text-yellow-500 hover:bg-yellow-50'
            }`}
            title={note.is_starred ? "Unstar note" : "Star note"}
          >
            <svg 
              className="w-4 h-4" 
              fill={note.is_starred ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement more options menu
            }}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all duration-200"
            title="More options"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <div className="mb-4">
        <p 
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {note.content ? getPreviewText(note.content) : (
            <span 
              className="italic"
              style={{ color: 'var(--color-neutral-400)' }}
            >
              No content
            </span>
          )}
        </p>
      </div>

      {/* Tags placeholder - will be implemented in Phase 3 */}
      {/* <div className="flex items-center space-x-2 mb-4">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
          #tag-1
        </span>
      </div> */}

      {/* Footer */}
        <div 
          className="flex items-center justify-between text-xs"
          style={{ color: 'var(--color-neutral-400)' }}
        >
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatDate(note.updated_at)}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{getWordCount(note.content)} words</span>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="w-2 h-2 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>
  );
}
