mod commands;

use tauri::{Manager, WindowEvent};
use std::collections::HashMap;
use std::sync::Mutex;

type NotesStorage = Mutex<HashMap<i64, commands::Note>>;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(NotesStorage::new(HashMap::new()))
        .invoke_handler(tauri::generate_handler![
            commands::add_note,
            commands::get_notes,
            commands::update_note,
            commands::delete_note,
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