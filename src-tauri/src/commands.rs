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
}

#[tauri::command]
pub async fn add_note(
    pool: State<'_, Arc<SqlitePool>>,
    title: String,
    content: String,
) -> Result<Note, String> {
    let now = chrono::Utc::now().to_rfc3339();
    
    // Insert the new note
    let result = sqlx::query(
        "INSERT INTO notes (title, content, created_at, updated_at) VALUES (?, ?, ?, ?)"
    )
    .bind(&title)
    .bind(&content)
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
        created_at: now.clone(),
        updated_at: now,
    })
}

#[tauri::command]
pub async fn get_notes(pool: State<'_, Arc<SqlitePool>>) -> Result<Vec<Note>, String> {
    // Query all notes ordered by updated_at descending
    let rows = sqlx::query(
        "SELECT id, title, content, created_at, updated_at FROM notes ORDER BY updated_at DESC"
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
        "SELECT id, title, content, created_at, updated_at FROM notes WHERE id = ?"
    )
    .bind(id)
    .fetch_one(&**pool)
    .await
    .map_err(|e| e.to_string())?;
    
    let note = Note {
        id: row.get::<i64, _>("id"),
        title: row.get::<String, _>("title"),
        content: row.get::<String, _>("content"),
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