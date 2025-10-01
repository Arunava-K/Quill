import { ReactNode } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useState } from "react";
import { Note } from "../types";
import NoteCard from "../components/NoteCard";

interface DragAndDropProviderProps {
  children: ReactNode;
  onNoteDrop: (noteId: number, folderId: number | null) => void;
}

export function DragAndDropProvider({ children, onNoteDrop }: DragAndDropProviderProps) {
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  // Configure sensors for better drag experience
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before starting drag
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "note") {
      setActiveNote(active.data.current.note);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveNote(null);

    if (!over) return;

    // Handle note dropped on folder
    if (active.data.current?.type === "note" && over.data.current?.type === "folder") {
      const noteId = active.data.current.note.id;
      const folderId = over.data.current.folder.id;
      onNoteDrop(noteId, folderId);
    }

    // Handle note dropped on root (All Notes area)
    if (active.data.current?.type === "note" && over.data.current?.type === "root") {
      const noteId = active.data.current.note.id;
      onNoteDrop(noteId, null);
    }
  };

  const handleDragCancel = () => {
    setActiveNote(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeNote ? (
          <div
            style={{
              cursor: "grabbing",
              transform: "rotate(2deg)",
              opacity: 0.9,
              pointerEvents: "none",
            }}
          >
            <div style={{ 
              filter: "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15))",
              maxWidth: "384px",
            }}>
              <NoteCard
                note={activeNote}
                onClick={() => {}}
                showFolder={false}
              />
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
