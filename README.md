# Quill - Quick Note Taking App

A simple, fast note-taking application built with Tauri, React, TypeScript, and SQLite.

## Features

- **Main Window**: Browse and edit notes with a clean sidebar and editor interface
- **Quick Note**: Global shortcut (`Ctrl+Shift+N`) opens a frameless quick note window
- **SQLite Database**: All notes are stored locally in SQLite
- **Real-time Updates**: Notes are automatically saved and updated
- **Modern UI**: Built with TailwindCSS for a clean, responsive design

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v16 or later)
2. **Rust** (latest stable version)
   - Install from: https://rustup.rs/
3. **System Dependencies** for Tauri
   - Windows: Microsoft C++ Build Tools
   - macOS: Xcode Command Line Tools
   - Linux: See [Tauri prerequisites](https://tauri.app/start/prerequisites/)

## Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run in development mode**:
   ```bash
   npm run tauri dev
   ```

3. **Build for production**:
   ```bash
   npm run tauri build
   ```

## Usage

### Main Application
- Click "New Note" to create a new note
- Select notes from the sidebar to edit them
- Notes are automatically saved when you make changes
- Use the delete button (trash icon) to remove notes

### Quick Note Feature
- Press `Ctrl+Shift+N` anywhere on your system to open the quick note window
- Type your note and click "Save" or press `Ctrl+S`
- The note will be saved to your database and the window will close
- Press `Esc` to cancel and close the quick note window

## Database

The application uses SQLite to store notes locally. The database file (`notes.db`) is created automatically in the application's data directory.

### Database Schema

```sql
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
├── src/                    # React frontend
│   ├── components/         # React components
│   │   ├── NotesList.tsx   # Sidebar note list
│   │   ├── NoteEditor.tsx  # Main note editor
│   │   └── QuickNoteWindow.tsx # Quick note popup
│   ├── App.tsx            # Main application
│   ├── types.ts           # TypeScript types
│   └── quick-note.tsx     # Quick note entry point
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── commands.rs    # Database commands
│   │   ├── lib.rs         # Main Tauri setup
│   │   └── main.rs        # Application entry point
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
└── public/                # Static assets
    └── quick-note.html    # Quick note window HTML
```

## Technologies Used

- **Frontend**: React 18, TypeScript, TailwindCSS, Vite
- **Backend**: Rust, Tauri 2.0
- **Database**: SQLite with tauri-plugin-sql
- **Global Shortcuts**: tauri-plugin-global-shortcut

## License

This project is open source and available under the MIT License.