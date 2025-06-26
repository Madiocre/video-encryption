use rand::Rng;
use std::fs::File;
use std::io::{Read, Write, BufReader, BufWriter};
use std::path::Path;
use aes::Aes128;
use p12_keystore::{KeyStore, KeyStoreEntry, PrivateKeyChain, Certificate};
use rsa::{pkcs8::DecodePublicKey, Pkcs1v15Encrypt, RsaPublicKey};
use rcgen::{generate_simple_self_signed, CertifiedKey};
use base64::prelude::*;
use ctr::cipher::{KeyIvInit, StreamCipher};
use ctr::Ctr128BE;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use sha2::{Sha256, Digest};

type AesCtr = Ctr128BE<Aes128>;

#[derive(Serialize, Deserialize)]
struct VideoMetadata {
    filename: String,
    collection_id: String,
}

const BUFFER_SIZE: usize = 4 * 1024;

fn generate_aes_key() -> [u8; 16] {
    let mut rng = rand::thread_rng();
    let key: [u8; 16] = rng.gen();
    key
}

fn load_aes_key_from_p12(path: &str, password: &str) -> Result<(String, [u8; 16]), String> {
    let mut certificate_file = File::open(path).map_err(|e| e.to_string())?;
    let mut pkcs12_data = vec![];
    certificate_file.read_to_end(&mut pkcs12_data).map_err(|e| e.to_string())?;
    let keystore = KeyStore::from_pkcs12(&pkcs12_data, password).map_err(|e| e.to_string())?;
    let entry = keystore.entries().next().ok_or("No entries in keystore".to_string())?;
    let collection_id = entry.0.to_string();
    let KeyStoreEntry::PrivateKeyChain(keystore) = entry.1 else {
        return Err("Unexpected variant!".to_string());
    };
    let key: [u8; 16] = keystore.key().try_into().map_err(|_| "Invalid key length".to_string())?;
    Ok((collection_id, key))
}

fn load_public_key(base64_key: &str) -> Result<RsaPublicKey, String> {
    let key_bytes = BASE64_STANDARD.decode(base64_key).map_err(|e| e.to_string())?;
    RsaPublicKey::from_public_key_der(&key_bytes).map_err(|e| e.to_string())
}

pub fn generate_certificate(password: &str, output: &str) -> Result<(), String> {
    let key = generate_aes_key();
    let collection_id = Uuid::new_v4();
    let subject_alt_names = vec!["hello.world.example".to_string(), "localhost".to_string()];
    let CertifiedKey { cert, .. } = generate_simple_self_signed(subject_alt_names).map_err(|e| e.to_string())?;
    let cert = Certificate::from_der(&cert.der()).map_err(|e| e.to_string())?;
    let mut keystore = KeyStore::new();
    let private_key_chain = PrivateKeyChain::new(key, Uuid::new_v4().as_bytes().to_vec(), vec![cert]);
    let entry = KeyStoreEntry::PrivateKeyChain(private_key_chain);
    keystore.add_entry(&collection_id.to_string(), entry);
    let writer = keystore.writer(password);
    let pkcs_12 = writer.write().map_err(|e| e.to_string())?;
    let mut file = File::create(output).map_err(|e| e.to_string())?;
    file.write_all(&pkcs_12).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn generate_access_key(public_key: &str, certificate: &str, password: &str) -> Result<String, String> {
    let (_, aes_key) = load_aes_key_from_p12(certificate, password)?;
    let rsa_key = load_public_key(public_key)?;
    let mut rng = rand::thread_rng();
    let encrypted_key = rsa_key.encrypt(&mut rng, Pkcs1v15Encrypt, &aes_key).map_err(|e| e.to_string())?;
    Ok(BASE64_STANDARD.encode(encrypted_key))
}

pub fn encrypt_video(video: &str, certificate: &str, password: &str, output: &str) -> Result<(), String> {
    let (collection_id, key) = load_aes_key_from_p12(certificate, password)?;
    let iv = [0u8; 16];
    let mut cipher = AesCtr::new(&key.into(), &iv.into());
    let video_path = Path::new(video);
    let video_file = File::open(video_path).map_err(|e| e.to_string())?;
    let output_file = File::create(output).map_err(|e| e.to_string())?;
    let file_metadata = std::fs::metadata(video_path).map_err(|e| e.to_string())?;
    let file_size = file_metadata.len();
    let file_name = video_path.file_name()
        .ok_or("No file name found".to_string())?
        .to_str()
        .ok_or("Invalid UTF-8 in file name".to_string())?
        .to_string();
    let metadata = VideoMetadata {
        filename: file_name,
        collection_id,
    };
    let metadata_json = serde_json::to_string(&metadata).map_err(|e| e.to_string())?;
    let mut reader = BufReader::new(video_file);
    let mut writer = BufWriter::new(output_file);
    let metadata_size = metadata_json.len();
    writer.write_all(b"EVMP").map_err(|e| e.to_string())?;
    writer.write_all(&[1, 0]).map_err(|e| e.to_string())?;
    writer.write_all(&(file_size as u32).to_le_bytes()).map_err(|e| e.to_string())?;
    writer.write_all(&(metadata_size as u32).to_le_bytes()).map_err(|e| e.to_string())?;
    let mut buffer = [0u8; BUFFER_SIZE];
    while let Ok(bytes_read) = reader.read(&mut buffer) {
        if bytes_read == 0 {
            break;
        }
        cipher.apply_keystream(&mut buffer[..bytes_read]);
        writer.write_all(&buffer[..bytes_read]).map_err(|e| e.to_string())?;
    }
    writer.write_all(metadata_json.as_bytes()).map_err(|e| e.to_string())?;
    let mut hasher = Sha256::new();
    hasher.update(key);
    let hash_key = hasher.finalize();
    writer.write_all(&hash_key).map_err(|e| e.to_string())?;
    Ok(())
}