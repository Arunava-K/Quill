-- Extend notes table to support folders and starring
ALTER TABLE notes ADD COLUMN folder_id INTEGER REFERENCES folders(id) ON DELETE SET NULL;
ALTER TABLE notes ADD COLUMN is_starred BOOLEAN DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_folder_id ON notes(folder_id);
CREATE INDEX IF NOT EXISTS idx_notes_is_starred ON notes(is_starred);
