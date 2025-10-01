use serde::{Deserialize, Serialize};
use tauri::State;
use sqlx::{SqlitePool, Row};
use std::sync::Arc;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Note {
    pub id: i64,
    pub title: String,
    pub content: String,
    pub created_at: String,
    pub updated_at: String,
    pub folder_id: Option<i64>,
    pub is_starred: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Folder {
    pub id: i64,
    pub name: String,
    pub parent_id: Option<i64>,
    pub created_at: String,
    pub updated_at: String,
}

#[tauri::command]
pub async fn add_note(
    pool: State<'_, Arc<SqlitePool>>,
    title: String,
    content: String,
    folder_id: Option<i64>,
) -> Result<Note, String> {
    let now = chrono::Utc::now().to_rfc3339();
    
    // Insert the new note
    let result = sqlx::query(
        "INSERT INTO notes (title, content, folder_id, is_starred, created_at, updated_at) VALUES (?, ?, ?, 0, ?, ?)"
    )
    .bind(&title)
    .bind(&content)
    .bind(folder_id)
    .bind(&now)
    .bind(&now)
    .execute(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    let id = result.last_insert_rowid();
    
    Ok(Note {
        id,
        title,
        content,
        folder_id,
        is_starred: false,
        created_at: now.clone(),
        updated_at: now,
    })
}

#[tauri::command]
pub async fn get_notes(pool: State<'_, Arc<SqlitePool>>) -> Result<Vec<Note>, String> {
    // Query all notes ordered by updated_at descending
    let rows = sqlx::query(
        "SELECT id, title, content, folder_id, is_starred, created_at, updated_at FROM notes ORDER BY updated_at DESC"
    )
    .fetch_all(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    let mut notes = Vec::new();
    for row in rows {
        let note = Note {
            id: row.get::<i64, _>("id"),
            title: row.get::<String, _>("title"),
            content: row.get::<String, _>("content"),
            folder_id: row.try_get::<Option<i64>, _>("folder_id").ok().flatten(),
            is_starred: row.get::<bool, _>("is_starred"),
            created_at: row.get::<String, _>("created_at"),
            updated_at: row.get::<String, _>("updated_at"),
        };
        notes.push(note);
    }
    
    Ok(notes)
}

#[tauri::command]
pub async fn update_note(
    pool: State<'_, Arc<SqlitePool>>,
    id: i64,
    title: String,
    content: String,
) -> Result<Note, String> {
    let now = chrono::Utc::now().to_rfc3339();
    
    // Update the note
    let result = sqlx::query(
        "UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?"
    )
    .bind(&title)
    .bind(&content)
    .bind(&now)
    .bind(id)
    .execute(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    if result.rows_affected() == 0 {
        return Err("Note not found".to_string());
    }
    
    // Get the updated note
    let row = sqlx::query(
        "SELECT id, title, content, folder_id, is_starred, created_at, updated_at FROM notes WHERE id = ?"
    )
    .bind(id)
    .fetch_one(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    let note = Note {
        id: row.get::<i64, _>("id"),
        title: row.get::<String, _>("title"),
        content: row.get::<String, _>("content"),
        folder_id: row.try_get::<Option<i64>, _>("folder_id").ok().flatten(),
        is_starred: row.get::<bool, _>("is_starred"),
        created_at: row.get::<String, _>("created_at"),
        updated_at: row.get::<String, _>("updated_at"),
    };
    
    Ok(note)
}

#[tauri::command]
pub async fn delete_note(pool: State<'_, Arc<SqlitePool>>, id: i64) -> Result<(), String> {
    // Delete the note
    let result = sqlx::query(
        "DELETE FROM notes WHERE id = ?"
    )
    .bind(id)
    .execute(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    if result.rows_affected() == 0 {
        return Err("Note not found".to_string());
    }
    
    Ok(())
}

// ============================================
// Folder Commands
// ============================================

#[tauri::command]
pub async fn create_folder(
    pool: State<'_, Arc<SqlitePool>>,
    name: String,
    parent_id: Option<i64>,
) -> Result<Folder, String> {
    let now = chrono::Utc::now().to_rfc3339();
    
    let result = sqlx::query(
        "INSERT INTO folders (name, parent_id, created_at, updated_at) VALUES (?, ?, ?, ?)"
    )
    .bind(&name)
    .bind(parent_id)
    .bind(&now)
    .bind(&now)
    .execute(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    let id = result.last_insert_rowid();
    
    Ok(Folder {
        id,
        name,
        parent_id,
        created_at: now.clone(),
        updated_at: now,
    })
}

#[tauri::command]
pub async fn get_folders(pool: State<'_, Arc<SqlitePool>>) -> Result<Vec<Folder>, String> {
    let rows = sqlx::query(
        "SELECT id, name, parent_id, created_at, updated_at FROM folders ORDER BY name ASC"
    )
    .fetch_all(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    let mut folders = Vec::new();
    for row in rows {
        let folder = Folder {
            id: row.get::<i64, _>("id"),
            name: row.get::<String, _>("name"),
            parent_id: row.try_get::<Option<i64>, _>("parent_id").ok().flatten(),
            created_at: row.get::<String, _>("created_at"),
            updated_at: row.get::<String, _>("updated_at"),
        };
        folders.push(folder);
    }
    
    Ok(folders)
}

#[tauri::command]
pub async fn update_folder(
    pool: State<'_, Arc<SqlitePool>>,
    id: i64,
    name: String,
    parent_id: Option<i64>,
) -> Result<Folder, String> {
    let now = chrono::Utc::now().to_rfc3339();
    
    // Prevent circular references
    if let Some(pid) = parent_id {
        if pid == id {
            return Err("A folder cannot be its own parent".to_string());
        }
        // TODO: Add more sophisticated cycle detection for nested folders
    }
    
    let result = sqlx::query(
        "UPDATE folders SET name = ?, parent_id = ?, updated_at = ? WHERE id = ?"
    )
    .bind(&name)
    .bind(parent_id)
    .bind(&now)
    .bind(id)
    .execute(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    if result.rows_affected() == 0 {
        return Err("Folder not found".to_string());
    }
    
    let row = sqlx::query(
        "SELECT id, name, parent_id, created_at, updated_at FROM folders WHERE id = ?"
    )
    .bind(id)
    .fetch_one(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    let folder = Folder {
        id: row.get::<i64, _>("id"),
        name: row.get::<String, _>("name"),
        parent_id: row.try_get::<Option<i64>, _>("parent_id").ok().flatten(),
        created_at: row.get::<String, _>("created_at"),
        updated_at: row.get::<String, _>("updated_at"),
    };
    
    Ok(folder)
}

#[tauri::command]
pub async fn delete_folder(pool: State<'_, Arc<SqlitePool>>, id: i64) -> Result<(), String> {
    // First, set folder_id to NULL for all notes in this folder
    sqlx::query("UPDATE notes SET folder_id = NULL WHERE folder_id = ?")
        .bind(id)
        .execute(&**pool)
        .await
        .map_err(|e| e.to_string())?;
    
    // Delete the folder
    let result = sqlx::query("DELETE FROM folders WHERE id = ?")
        .bind(id)
        .execute(&**pool)
        .await
        .map_err(|e| e.to_string())?;
    
    if result.rows_affected() == 0 {
        return Err("Folder not found".to_string());
    }
    
    Ok(())
}

#[tauri::command]
pub async fn move_note_to_folder(
    pool: State<'_, Arc<SqlitePool>>,
    note_id: i64,
    folder_id: Option<i64>,
) -> Result<Note, String> {
    let now = chrono::Utc::now().to_rfc3339();
    
    let result = sqlx::query(
        "UPDATE notes SET folder_id = ?, updated_at = ? WHERE id = ?"
    )
    .bind(folder_id)
    .bind(&now)
    .bind(note_id)
    .execute(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    if result.rows_affected() == 0 {
        return Err("Note not found".to_string());
    }
    
    // Get the updated note
    let row = sqlx::query(
        "SELECT id, title, content, folder_id, is_starred, created_at, updated_at FROM notes WHERE id = ?"
    )
    .bind(note_id)
    .fetch_one(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    let note = Note {
        id: row.get::<i64, _>("id"),
        title: row.get::<String, _>("title"),
        content: row.get::<String, _>("content"),
        folder_id: row.try_get::<Option<i64>, _>("folder_id").ok().flatten(),
        is_starred: row.get::<bool, _>("is_starred"),
        created_at: row.get::<String, _>("created_at"),
        updated_at: row.get::<String, _>("updated_at"),
    };
    
    Ok(note)
}

#[tauri::command]
pub async fn toggle_note_starred(
    pool: State<'_, Arc<SqlitePool>>,
    note_id: i64,
) -> Result<Note, String> {
    // Toggle the is_starred field WITHOUT updating the updated_at timestamp
    // Starring/unstarring should not affect the note's modification date
    let result = sqlx::query(
        "UPDATE notes SET is_starred = NOT is_starred WHERE id = ?"
    )
    .bind(note_id)
    .execute(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    if result.rows_affected() == 0 {
        return Err("Note not found".to_string());
    }
    
    // Get the updated note
    let row = sqlx::query(
        "SELECT id, title, content, folder_id, is_starred, created_at, updated_at FROM notes WHERE id = ?"
    )
    .bind(note_id)
    .fetch_one(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    let note = Note {
        id: row.get::<i64, _>("id"),
        title: row.get::<String, _>("title"),
        content: row.get::<String, _>("content"),
        folder_id: row.try_get::<Option<i64>, _>("folder_id").ok().flatten(),
        is_starred: row.get::<bool, _>("is_starred"),
        created_at: row.get::<String, _>("created_at"),
        updated_at: row.get::<String, _>("updated_at"),
    };
    
    Ok(note)
}

#[tauri::command]
pub async fn get_notes_by_folder(
    pool: State<'_, Arc<SqlitePool>>,
    folder_id: Option<i64>,
) -> Result<Vec<Note>, String> {
    let query = if folder_id.is_some() {
        "SELECT id, title, content, folder_id, is_starred, created_at, updated_at FROM notes WHERE folder_id = ? ORDER BY updated_at DESC"
    } else {
        "SELECT id, title, content, folder_id, is_starred, created_at, updated_at FROM notes WHERE folder_id IS NULL ORDER BY updated_at DESC"
    };
    
    let rows = if let Some(fid) = folder_id {
        sqlx::query(query)
            .bind(fid)
            .fetch_all(&**pool)
            .await
            .map_err(|e| e.to_string())?
    } else {
        sqlx::query(query)
            .fetch_all(&**pool)
            .await
            .map_err(|e| e.to_string())?
    };
    
    let mut notes = Vec::new();
    for row in rows {
        let note = Note {
            id: row.get::<i64, _>("id"),
            title: row.get::<String, _>("title"),
            content: row.get::<String, _>("content"),
            folder_id: row.try_get::<Option<i64>, _>("folder_id").ok().flatten(),
            is_starred: row.get::<bool, _>("is_starred"),
            created_at: row.get::<String, _>("created_at"),
            updated_at: row.get::<String, _>("updated_at"),
        };
        notes.push(note);
    }
    
    Ok(notes)
}