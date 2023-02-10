#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// use std::path::PathBuf;
// use std::process::Command;
use tauri::{Manager, PhysicalPosition, SystemTray, SystemTrayEvent};
use window_vibrancy::apply_acrylic;

fn main() {
    // let tray = SystemTray::new();
    tauri::Builder::default()
        // .invoke_handler(tauri::generate_handler![
        //     execute,
        //   ])
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            let app_size = window.outer_size().unwrap();
            let mon_result = window.primary_monitor().unwrap();
            if let Some(mon) = mon_result {
                window.set_position(
                    PhysicalPosition::new(
                        mon.size().width - app_size.width,
                        mon.size().height - app_size.height - 30    // 30 -> taskbar height
                    )
                ).unwrap();
            }

            #[cfg(target_os = "windows")]
            apply_acrylic(&window, Some((20, 20, 20, 128)))
                .expect("Unsupported platform! 'apply_acrylic' is only supported on Windows");
            window.minimize().unwrap();
            Ok(())
        })
        .system_tray(SystemTray::new())
        .on_system_tray_event(|app, event| if let SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } = event {
                let main_window = app.get_window("main").unwrap();
                main_window.unminimize().unwrap();
                main_window.set_focus().unwrap();
            })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// #[tauri::command]
// fn execute(window: tauri::Window, file_path: &str) {
//     let path = PathBuf::from(file_path);
//     Command::new(file_path)
//         // .args(["/C", file_path])
//         .current_dir(path.parent().unwrap())
//         .spawn()
//         .expect("...failed to execute process...");
//     window.minimize().unwrap();
// }
