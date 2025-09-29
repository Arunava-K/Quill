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
    <div className="flex flex-wrap gap-6">
      {notes.map((note, index) => (
        <NoteCard
          key={note.id}
          note={note}
          onClick={() => onSelectNote(note)}
          className={`animate-fade-in flex-1 min-w-[300px] max-w-[calc(33.333%-16px)]`}
          style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
