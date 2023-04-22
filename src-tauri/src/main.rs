#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use mac_address::{get_mac_address as get_mac};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_mac_address])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_mac_address() -> String {
    let res: String = match get_mac() {
        Ok(res) => match res {
            Some(address) => address.to_string().into(),
            None => "get null of mac address".into()
        },
        Err(err) => err.to_string().into()
    };

    res
}
