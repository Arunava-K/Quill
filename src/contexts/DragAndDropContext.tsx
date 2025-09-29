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
      <DragOverlay>
        {activeNote ? (
          <div
            className="p-4 rounded-xl shadow-2xl cursor-grabbing opacity-90"
            style={{
              backgroundColor: "var(--color-background)",
              border: "2px solid var(--color-primary-500)",
              maxWidth: "300px",
            }}
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "var(--color-text-secondary)" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span
                className="font-semibold truncate"
                style={{ color: "var(--color-text-primary)" }}
              >
                {activeNote.title || "Untitled"}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
