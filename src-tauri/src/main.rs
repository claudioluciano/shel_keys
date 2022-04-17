#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{
  api::dialog::ask, window::WindowBuilder, CustomMenuItem,
  GlobalShortcutManager, Manager, RunEvent, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
  WindowEvent,
};

fn main() {
  let tray_menu = SystemTrayMenu::new()
    .add_item(CustomMenuItem::new("shel_keys".to_string(), "Shel Keys").disabled())
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(CustomMenuItem::new("quit".to_string(), "Quit"));

  let app = tauri::Builder::default()
    .setup(|app| {
      WindowBuilder::new(
        app,
        "keys".to_string(),
        tauri::WindowUrl::App("index.html#keys".into()),
      )
      .title("Keys")
      .inner_size(1280.0, 720.0)
      .center()
      .always_on_top(true)
      .visible(false)
      .build();

      // let window = app.get_window("keys-window").unwrap();
      // window.close();
      // let window_ = window.clone();
      // window.on_window_event(move |event| match event {
      //   WindowEvent::CloseRequested { api, .. } => {
      //     api.prevent_close();
      //     window_.hide().unwrap();
      //   }
      //   _ => {}
      // });
      Ok(())
    })
    // .on_window_event(|event| match event.event() {
    //   WindowEvent::CloseRequested { api, .. } => {
    //     event.window().close().unwrap();
    //     api.prevent_close();
    //   }
    //   _ => {}
    // })
    .system_tray(SystemTray::new().with_menu(tray_menu))
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::DoubleClick {
        position: _,
        size: _,
        ..
      } => {
        WindowBuilder::new(
          app,
          "configuration".to_string(),
          tauri::WindowUrl::App("index.html".into()),
        )
        .title("Configuration")
        .inner_size(1280.0, 720.0)
        .center()
        .visible(true)
        .build();
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
    // Application is ready (triggered only once)
    RunEvent::Ready => {
      // let app_handle = app_handle.clone();
      // app_handle
      //   .global_shortcut_manager()
      //   .register("CmdOrCtrl+1", move || {
      //     let app_handle = app_handle.clone();
      //     let window = app_handle.get_window("main").unwrap();
      //     window.set_title("New title!").unwrap();
      //   })
      //   .unwrap();
    }

    // Triggered when a window is trying to close
    RunEvent::WindowEvent {
      label,
      event: WindowEvent::CloseRequested { api, .. },
      ..
    } => {
      if label == "keys" {
        let app_handle = app_handle.clone();
        let window = app_handle.get_window(&label).unwrap();
        api.prevent_close();

        window.hide().unwrap();
      }

      
      // use the exposed close api, and prevent the event loop to close
      // ask the user if he wants to quit
      // ask(
      //   Some(&window),
      //   "Tauri API",
      //   "Are you sure that you want to close this window?",
      //   move |answer| {
      //     if answer {
      //       // .close() cannot be called on the main thread
      //       std::thread::spawn(move || {
      //         app_handle.get_window(&label).unwrap().close().unwrap();
      //       });
      //     }
      //   },
      // );
    }

    // Keep the event loop running even if all windows are closed
    // This allow us to catch system tray events when there is no window
    RunEvent::ExitRequested { api, .. } => {
      api.prevent_exit();
    }
    _ => {}
  })
}
