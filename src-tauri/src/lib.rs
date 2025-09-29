mod commands;

use tauri::{Manager, WindowEvent};
use sqlx::{SqlitePool, migrate::MigrateDatabase, Sqlite};
use std::sync::Arc;

const DATABASE_URL: &str = "sqlite:notes.db";

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    // Initialize database
    if !Sqlite::database_exists(DATABASE_URL).await.unwrap_or(false) {
        Sqlite::create_database(DATABASE_URL).await.expect("Failed to create database");
    }

    let pool = SqlitePool::connect(DATABASE_URL)
        .await
        .expect("Failed to connect to database");

    // Run migrations
    let migrations = vec![
        include_str!("../migrations/1_create_notes_table.sql"),
        include_str!("../migrations/2_create_folders_table.sql"),
        include_str!("../migrations/3_extend_notes_table.sql"),
    ];

    for (index, migration_sql) in migrations.iter().enumerate() {
        match sqlx::query(migration_sql).execute(&pool).await {
            Ok(_) => println!("Migration {} completed successfully", index + 1),
            Err(e) => {
                // If table/column already exists, that's fine - just log it
                if e.to_string().contains("already exists") || e.to_string().contains("duplicate column") {
                    println!("Migration {} already applied, skipping", index + 1);
                } else {
                    eprintln!("Warning: Migration {} had an error: {}", index + 1, e);
                    // Don't panic, just continue - some errors are expected
                }
            }
        }
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(Arc::new(pool))
        .invoke_handler(tauri::generate_handler![
            commands::add_note,
            commands::get_notes,
            commands::update_note,
            commands::delete_note,
            commands::create_folder,
            commands::get_folders,
            commands::update_folder,
            commands::delete_folder,
            commands::move_note_to_folder,
            commands::toggle_note_starred,
            commands::get_notes_by_folder,
            open_quick_note_window
        ])
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                if window.label() == "quick-note" {
                    window.hide().unwrap();
                    api.prevent_close();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn open_quick_note_window(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("quick-note") {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    } else {
        let window = tauri::WebviewWindowBuilder::new(
            &app,
            "quick-note",
            tauri::WebviewUrl::App("quick-note.html".into()),
        )
        .title("Quick Note")
        .inner_size(400.0, 300.0)
        .resizable(false)
        .decorations(false)
        .always_on_top(true)
        .center()
        .build()
        .map_err(|e| e.to_string())?;
        
        window.show().map_err(|e| e.to_string())?;
    }
    
    Ok(())
}