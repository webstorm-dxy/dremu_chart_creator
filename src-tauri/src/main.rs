#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// use tauri::{AppHandle, window::WindowBuilder, WindowUrl::External};

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


// #[tauri::command]
// async fn create_window(handle: AppHandle, id: String, url: String) {
//     WindowBuilder::new(&handle, id, External(url.parse().unwrap())).build().unwrap();
// }
