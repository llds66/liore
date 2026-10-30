// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod tray;

use tauri::{Manager, WindowEvent, webview::PageLoadEvent};
use tauri_plugin_window_state::StateFlags;

const WINDOW_STATE_FLAGS: StateFlags = StateFlags::SIZE
    .union(StateFlags::POSITION)
    .union(StateFlags::MAXIMIZED);

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            tray::restore_main_window(app);
        }))
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_window_state::Builder::default()
                .with_state_flags(WINDOW_STATE_FLAGS)
                .build(),
        )
        .manage(tray::StartupState::default())
        .manage(tray::TrayMenuState::default())
        .setup(|app| {
            if let Err(error) = tray::install(app) {
                eprintln!("Failed to initialize Liore tray: {error}");
            }
            Ok(())
        })
        .on_page_load(|webview, payload| {
            if webview.label() == "main" && payload.event() == PageLoadEvent::Finished {
                tray::main_page_ready(webview.app_handle());
            }
        })
        .on_window_event(|window, event| {
            if window.label() == "main"
                && window.app_handle().tray_by_id(tray::TRAY_ID).is_some()
                && let WindowEvent::CloseRequested { api, .. } = event
                && window.hide().is_ok()
            {
                api.prevent_close();
            }
        })
        .invoke_handler(tauri::generate_handler![greet, tray::set_tray_language])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
