use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Note {
    pub id: i64,
    pub title: String,
    pub content: String,
    pub created_at: String,
    pub updated_at: String,
}

// In-memory storage for now (we'll replace with SQLite later)
use std::sync::Mutex;
use std::collections::HashMap;

type NotesStorage = Mutex<HashMap<i64, Note>>;

#[tauri::command]
pub async fn add_note(
    app: tauri::AppHandle,
    title: String,
    content: String,
) -> Result<Note, String> {
    let storage = app.state::<NotesStorage>();
    let mut notes = storage.lock().unwrap();
    
    let id = notes.len() as i64 + 1;
    let now = chrono::Utc::now().to_rfc3339();
    
    let note = Note {
        id,
        title: title.clone(),
        content: content.clone(),
        created_at: now.clone(),
        updated_at: now,
    };
    
    notes.insert(id, note.clone());
    Ok(note)
}

#[tauri::command]
pub async fn get_notes(app: tauri::AppHandle) -> Result<Vec<Note>, String> {
    let storage = app.state::<NotesStorage>();
    let notes = storage.lock().unwrap();
    
    let mut notes_vec: Vec<Note> = notes.values().cloned().collect();
    notes_vec.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
    
    Ok(notes_vec)
}

#[tauri::command]
pub async fn update_note(
    app: tauri::AppHandle,
    id: i64,
    title: String,
    content: String,
) -> Result<Note, String> {
    let storage = app.state::<NotesStorage>();
    let mut notes = storage.lock().unwrap();
    
    if let Some(note) = notes.get_mut(&id) {
        note.title = title.clone();
        note.content = content.clone();
        note.updated_at = chrono::Utc::now().to_rfc3339();
        Ok(note.clone())
    } else {
        Err("Note not found".to_string())
    }
}

#[tauri::command]
pub async fn delete_note(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    let storage = app.state::<NotesStorage>();
    let mut notes = storage.lock().unwrap();
    
    if notes.remove(&id).is_some() {
        Ok(())
    } else {
        Err("Note not found".to_string())
    }
}