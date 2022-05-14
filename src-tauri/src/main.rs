#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{
  CustomMenuItem, 
  Manager, 
  RunEvent, 
  SystemTray, 
  SystemTrayEvent,
  SystemTrayMenu, 
  SystemTrayMenuItem,
  WindowEvent
};

use mki::{Keyboard};
use enigo::*;

#[tauri::command]
fn send_text(message: &str) {
  let mut enigo = Enigo::new();
  enigo.key_sequence(message);
}

#[tauri::command]
fn capslock_status() -> bool {
  return Keyboard::CapsLock.is_toggled()
}

fn main() {
  let tray_menu = SystemTrayMenu::new()
    .add_item(CustomMenuItem::new("shel_keys".to_string(), "Shel Keys").disabled())
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(CustomMenuItem::new("quit".to_string(), "Quit"));

  let app = tauri::Builder::default()
    .plugin(tauri_plugin_positioner::init())
    .invoke_handler(tauri::generate_handler![send_text, capslock_status])
    .system_tray(SystemTray::new().with_menu(tray_menu))
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::DoubleClick {
        position: _,
        size: _,
        ..
      } => {
        let window = app.get_window("configuration").unwrap();
        window.show().unwrap();
      }
      SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
        "quit" => {
          std::process::exit(0);
        }
        _ => {}
      },
      _ => {}
    })
    .build(tauri::generate_context!())
    .expect("error while running tauri application");

  app.run(|app_handle, e| match e {
     // Triggered when a window is trying to close
     RunEvent::WindowEvent {
      label,
      event: WindowEvent::CloseRequested { api, .. },
      ..
    } => {
      let app_handle = app_handle.clone();
      api.prevent_close();
      app_handle.get_window(&label).unwrap().hide().unwrap();
    }
    // Keep the event loop running even if all windows are closed
    // This allow us to catch system tray events when there is no window
    RunEvent::ExitRequested { api, .. } => {
      api.prevent_exit();
    }
    _ => {}
  })
}
