use std::sync::{
    Mutex,
    atomic::{AtomicBool, Ordering},
};

use tauri::{
    App, AppHandle, Manager,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};
use tauri_plugin_window_state::AppHandleExt;

use crate::WINDOW_STATE_FLAGS;

pub const TRAY_ID: &str = "liore";
const SHOW_ID: &str = "show-liore";
const QUIT_ID: &str = "quit-liore";

#[derive(Default)]
pub struct StartupState {
    page_ready: AtomicBool,
}

struct TrayMenuItems {
    show: MenuItem<tauri::Wry>,
    quit: MenuItem<tauri::Wry>,
}

#[derive(Default)]
pub struct TrayMenuState(Mutex<TrayMenuStateInner>);

#[derive(Default)]
struct TrayMenuStateInner {
    chinese: bool,
    items: Option<TrayMenuItems>,
}

fn menu_labels(chinese: bool) -> (&'static str, &'static str) {
    if chinese {
        ("显示 Liore", "退出 Liore")
    } else {
        ("Show Liore", "Quit Liore")
    }
}

fn update_menu(items: &TrayMenuItems, chinese: bool) -> tauri::Result<()> {
    let (show, quit) = menu_labels(chinese);
    items.show.set_text(show)?;
    items.quit.set_text(quit)
}

pub fn main_page_ready(app: &AppHandle) {
    if !app
        .state::<StartupState>()
        .page_ready
        .swap(true, Ordering::SeqCst)
    {
        restore_main_window(app);
    }
}

pub fn restore_main_window(app: &AppHandle) {
    // A second launch or tray click during startup must not reveal the WebView early.
    if !app
        .state::<StartupState>()
        .page_ready
        .load(Ordering::SeqCst)
    {
        return;
    }

    if let Some(window) = app.get_webview_window("main") {
        if window.is_minimized().unwrap_or(false) {
            let _ = window.unminimize();
        }
        let _ = window.show();
        let _ = window.set_focus();
    }
}

pub fn install(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let icon = app
        .default_window_icon()
        .cloned()
        .ok_or_else(|| std::io::Error::other("Liore application icon is missing"))?;
    let show = MenuItem::with_id(app, SHOW_ID, "Show Liore", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, QUIT_ID, "Quit Liore", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show, &quit])?;

    TrayIconBuilder::with_id(TRAY_ID)
        .icon(icon)
        .tooltip("Liore")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                restore_main_window(tray.app_handle());
            }
        })
        .on_menu_event(|app, event| match event.id().as_ref() {
            SHOW_ID => restore_main_window(app),
            QUIT_ID => quit_app(app),
            _ => {}
        })
        .build(app)?;

    let tray_state = app.state::<TrayMenuState>();
    let mut state = tray_state.0.lock().unwrap();
    state.items = Some(TrayMenuItems { show, quit });
    if let Some(items) = &state.items
        && let Err(error) = update_menu(items, state.chinese)
    {
        eprintln!("Failed to update Liore tray menu language: {error}");
    }
    Ok(())
}

fn quit_app(app: &AppHandle) {
    if let Err(error) = app.save_window_state(WINDOW_STATE_FLAGS) {
        eprintln!("Failed to save Liore window state before exit: {error}");
    }
    app.exit(0);
}

#[tauri::command]
pub fn set_tray_language(app: AppHandle, language: String) -> Result<(), String> {
    let tray_state = app.state::<TrayMenuState>();
    let mut state = tray_state.0.lock().unwrap();
    state.chinese = language == "zh-CN";
    if let Some(items) = &state.items {
        update_menu(items, state.chinese).map_err(|e| e.to_string())?;
    }
    Ok(())
}
