// src/EncryptVideo.tsx
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Button from './components/ui/Button';
import InputGroup from './components/ui/InputGroup';
import StatusBox from './components/ui/StatusBox';
import BackButton from './components/BackButton';

function EncryptVideo() {
  const [encryptCert, setEncryptCert] = useState('');
  const [encryptPassword, setEncryptPassword] = useState('');
  const [videoPath, setVideoPath] = useState('');
  const [encryptOutput, setEncryptOutput] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const pickFile = async (
    setter: (value: string) => void,
    mode: 'open' | 'save' = 'open',
    extensions?: string[]
  ) => {
    try {
      let selected: string | null;
      if (mode === 'open') {
        selected = await open({
          filters: extensions ? [{ name: 'Files', extensions }] : undefined,
        });
      } else {
        selected = await save({
          filters: extensions ? [{ name: 'Files', extensions }] : undefined,
          defaultPath: 'encryptVid.vef',
        });
      }
      if (typeof selected === 'string') {
        setter(selected);
      }
    } catch (error) {
      console.error(`Error in ${mode} dialog:`, error);
    }
  };

  const encryptVideo = async () => {
    try {
      setStatus(`Encrypting Video ...`);
      const result = await invoke('encrypt_video', {
        certificate: encryptCert,
        password: encryptPassword,
        video: videoPath,
        output: encryptOutput,
      });
      setStatus(`Video encrypted: ${result}`);
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl sm:p-6 md:p-8">
      <button
        onClick={() => navigate('/')}
        className="mb-4 flex items-center text-lg hover:text-blue-500"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      <h2 className="text-xl mb-2 font-semibold">Encrypt Video</h2>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Certificate path (.p12)"
          value={encryptCert}
          onChange={(e) => setEncryptCert(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={() => pickFile(setEncryptCert, 'open', ['p12'])}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Browse
        </button>
      </div>
      <input
        type="password"
        placeholder="Password"
        value={encryptPassword}
        onChange={(e) => setEncryptPassword(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Video path"
          value={videoPath}
          onChange={(e) => setVideoPath(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={() => pickFile(setVideoPath, 'open', ['mp4', 'avi', 'mkv'])}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Browse
        </button>
      </div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Output path (.vef)"
          value={encryptOutput}
          onChange={(e) => setEncryptOutput(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={() => pickFile(setEncryptOutput, 'save', ['vef'])}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Browse
        </button>
      </div>
      <button
        onClick={encryptVideo}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Encrypt Video
      </button>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Status:</h3>
        <p>{status}</p>
      </div>
    </div>
  );
}

export default EncryptVideo;