#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod video_encryption;

use tauri::Builder;

#[tauri::command]
fn generate_certificate(password: String, output: String) -> Result<String, String> {
    video_encryption::generate_certificate(&password, &output)?;
    Ok(format!("Certificate generated at {}", output))
}

#[tauri::command]
fn encrypt_video(certificate: String, password: String, video: String, output: String) -> Result<String, String> {
    video_encryption::encrypt_video(&video, &certificate, &password, &output)?;
    Ok(format!("Video encrypted at {}", output))
}

#[tauri::command]
fn generate_access_key(key: String, certificate: String, password: String) -> Result<String, String> {
    video_encryption::generate_access_key(&key, &certificate, &password)
}

#[tauri::command]
fn close_app() {
    std::process::exit(0);
}

fn main() {
    Builder::default()
        .plugin(tauri_plugin_dialog::init()) 
        .plugin(tauri_plugin_clipboard_manager::init()) 
        .invoke_handler(tauri::generate_handler![
            generate_certificate,
            encrypt_video,
            generate_access_key,
            close_app
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
// // src-tauri/src/main.rs
// #![cfg_attr(
//     all(not(debug_assertions), target_os = "windows"),
//     windows_subsystem = "windows"
//   )]
  
//   mod video_encryption;
  
//   use tauri::Builder;
  
//   // Command to generate a certificate
//   #[tauri::command]
//   fn generate_certificate(password: String, output: String) -> Result<String, String> {
//       video_encryption::generate_certificate(&password, &output)?;
//       Ok(format!("Certificate generated at {}", output))
//   }
  
//   // Command to encrypt a video
//   #[tauri::command]
//   fn encrypt_video(certificate: String, password: String, video: String, output: String) -> Result<String, String> {
//       video_encryption::encrypt_video(&video, &certificate, &password, &output)?;
//       Ok(format!("Video encrypted at {}", output))
//   }
  
//   // Command to generate an access key
//   #[tauri::command]
//   fn generate_access_key(key: String, certificate: String, password: String) -> Result<String, String> {
//       video_encryption::generate_access_key(&key, &certificate, &password)
//   }
  
//   // Command to close the app (optional)
//   #[tauri::command]
//   fn close_app() {
//       std::process::exit(0);
//   }
  
//   fn main() {
//       Builder::default()
//           .invoke_handler(tauri::generate_handler![
//               generate_certificate,
//               encrypt_video,
//               generate_access_key,
//               close_app
//           ])
//           .run(tauri::generate_context!())
//           .expect("error while running tauri application");
//   }