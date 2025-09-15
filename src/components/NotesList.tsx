import { Note } from "../types";

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: number) => void;
}

export default function NotesList({ notes, selectedNote, onSelectNote, onDeleteNote }: NotesListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-neutral-600 font-medium mb-1">No notes yet</p>
          <p className="text-sm text-neutral-400">Click "New Note" to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
      {notes.map((note, index) => (
        <div
          key={note.id}
          className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-medium animate-fade-in ${
            selectedNote?.id === note.id 
              ? "bg-gradient-to-br from-primary-50 to-primary-100/50 border-2 border-primary-200 shadow-soft" 
              : "bg-white/70 hover:bg-white/90 border border-neutral-100 hover:border-primary-200"
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onSelectNote(note)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <h3 className={`font-semibold truncate mb-2 ${
                selectedNote?.id === note.id ? "text-primary-800" : "text-neutral-800"
              }`}>
                {note.title || "Untitled"}
              </h3>
              <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed mb-3">
                {note.content || "No content"}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-400 font-medium">
                  {formatDate(note.updated_at)}
                </p>
                {selectedNote?.id === note.id && (
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
              title="Delete note"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
