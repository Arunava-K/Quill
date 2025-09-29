# Drag and Drop Feature Documentation

## Overview
The drag-and-drop feature allows you to easily organize your notes by dragging them from the main content area and dropping them into folders in the sidebar. This provides a natural and intuitive way to manage your note organization.

## Features

### 1. **Drag Notes**
- Click and hold any note card in the home view
- The note will become semi-transparent (50% opacity) to indicate it's being dragged
- A preview overlay will follow your cursor showing the note's title

### 2. **Drop on Folders**
- Drag a note over any folder in the sidebar
- The folder will highlight with:
  - Light blue background (`var(--color-primary-100)`)
  - Primary blue text color (`var(--color-primary-700)`)
  - Dashed border to indicate it's a valid drop target
- Release the mouse to move the note into that folder

### 3. **Remove from Folders**
- Drag a note from any folder
- Drop it on the "Home" navigation item in the sidebar
- The note will be moved to the root level (no folder)
- The "Home" button will highlight when you hover over it with a note

### 4. **Visual Feedback**
- **During Drag:**
  - Dragged note becomes semi-transparent
  - Cursor changes to "grabbing"
  - Overlay shows note preview
  
- **Valid Drop Target:**
  - Target folder/area highlights in blue
  - Dashed border appears
  - Background color changes
  
- **After Drop:**
  - Note instantly updates with new folder assignment
  - UI refreshes to reflect the change

## Technical Implementation

### Components Modified

1. **DragAndDropContext.tsx** (New)
   - Wraps the entire application
   - Manages drag state and handles drop events
   - Uses `@dnd-kit/core` for drag-and-drop functionality
   - Collision detection: `closestCorners`
   - Activation constraint: 8px movement threshold

2. **NoteCard.tsx**
   - Made draggable using `useDraggable` hook
   - Each note has a unique ID: `note-${note.id}`
   - Carries note data during drag operation
   - Visual feedback during drag (opacity, cursor)

3. **FolderTree.tsx**
   - Made folders droppable using `useDroppable` hook
   - Each folder has a unique ID: `folder-${folder.id}`
   - Visual highlight when note is dragged over
   - Nested folders are individually droppable

4. **Sidebar.tsx**
   - "Home" button is a droppable zone for removing notes from folders
   - Drop zone ID: `all-notes-drop-zone`
   - Visual feedback when hovering with a note

5. **App.tsx**
   - Implements `handleNoteDrop` function
   - Calls backend `move_note_to_folder` command
   - Updates local state after successful move
   - Error handling with user alerts

### Backend Integration

The feature uses the existing `move_note_to_folder` Tauri command:

```rust
#[tauri::command]
pub async fn move_note_to_folder(
    pool: State<'_, Arc<SqlitePool>>,
    note_id: i64,
    folder_id: Option<i64>,
) -> Result<Note, String>
```

- `note_id`: The ID of the note to move
- `folder_id`: The target folder ID, or `null` to move to root
- Returns the updated note with new `folder_id`

## User Experience

### How to Use

1. **Organize a note into a folder:**
   - Find the note you want to organize
   - Click and hold on the note card
   - Drag it over to any folder in the sidebar
   - The folder will highlight in blue
   - Release to drop the note into the folder

2. **Move a note to root (remove from folder):**
   - Drag a note that's currently in a folder
   - Drop it on the "Home" button in the sidebar
   - The note will be moved out of its folder

3. **Move between folders:**
   - Drag a note from one folder
   - Drop it on a different folder
   - The note will be moved to the new folder

### Activation Threshold

The drag operation requires 8 pixels of movement before activating. This prevents accidental drags when clicking to open notes.

### Browser Support

The feature works across all modern browsers that support the Pointer Events API:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Tauri webview

## Accessibility

- The drag operation uses pointer sensors with a movement threshold
- Visual feedback is clear and prominent
- Reduced motion preferences are respected (via CSS)
- Keyboard shortcuts for folder management remain available

## Error Handling

If a drag-and-drop operation fails:
- An error is logged to the console
- A user-friendly alert appears: "Failed to move note. Please try again."
- The UI remains in its previous state (no partial updates)

## Performance Considerations

- Uses optimized collision detection (`closestCorners`)
- Drag overlay is rendered separately to avoid re-rendering main content
- State updates are batched for efficiency
- CSS transforms used for smooth animations

## Future Enhancements

Potential improvements for future versions:
- Multi-note selection and drag
- Drag-and-drop for folder reordering
- Undo/redo for move operations
- Bulk operations (drag multiple notes at once)
- Touch device support optimization
- Keyboard-based drag and drop for accessibility

## Dependencies

- `@dnd-kit/core`: Core drag-and-drop functionality
- `@dnd-kit/utilities`: Utility functions and CSS helpers
- `@dnd-kit/sortable`: (installed but not currently used, available for future enhancements)

## Testing

To test the drag-and-drop feature:

1. Create several notes
2. Create some folders in the sidebar
3. Drag notes from the home view onto folders
4. Verify the note appears in the folder when you click on it
5. Drag a note back to "Home" to remove it from the folder
6. Try dragging over different folders to see the visual feedback
7. Test edge cases like dragging to the same folder

## Known Limitations

- Cannot drag notes directly from the folder view (only from home/all notes view)
- Cannot drag notes between folders without going through the main view
- Touch devices may require additional configuration for optimal experience
- Notes must be visible in the current view to be dragged

## Code Quality

- TypeScript strict mode enabled
- No linter errors
- Follows existing code style and patterns
- Properly typed interfaces for drag data
- Error boundaries for graceful failure handling
