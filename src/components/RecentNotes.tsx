import { Note } from "../types";
import NoteCard from "./NoteCard";

interface RecentNotesProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
}

export default function RecentNotes({ notes, onSelectNote }: RecentNotesProps) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note, index) => (
        <NoteCard
          key={note.id}
          note={note}
          onClick={() => onSelectNote(note)}
          className={`animate-fade-in`}
          style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
