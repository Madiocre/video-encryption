import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
// import { useNavigate } from 'react-router-dom';
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
  // const navigate = useNavigate();

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
    <div className="container mx-auto p-4 max-w-3xl">
      <BackButton />
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Encrypt Video</h2>
        
        <InputGroup
          label="Certificate (.p12)"
          value={encryptCert}
          onChange={(e) => setEncryptCert(e.target.value)}
          button={
            <Button
              onClick={() => pickFile(setEncryptCert, 'open', ['p12'])}
              className="min-w-[100px]"
            >
              Browse
            </Button>
          }
        />
        
        <InputGroup
          label="Password"
          type="password"
          value={encryptPassword}
          onChange={(e) => setEncryptPassword(e.target.value)}
        />
        
        <InputGroup
          label="Video File"
          value={videoPath}
          onChange={(e) => setVideoPath(e.target.value)}
          button={
            <Button
              onClick={() => pickFile(setVideoPath, 'open', ['mp4', 'avi', 'mkv'])}
              className="min-w-[100px]"
            >
              Browse
            </Button>
          }
        />
        
        <InputGroup
          label="Output Path (.vef)"
          value={encryptOutput}
          onChange={(e) => setEncryptOutput(e.target.value)}
          button={
            <Button
              onClick={() => pickFile(setEncryptOutput, 'save', ['vef'])}
              className="min-w-[100px]"
            >
              Browse
            </Button>
          }
        />
        
        <div className="mt-6 flex justify-center">
          <Button
            onClick={encryptVideo}
            size="lg"
            className="w-full max-w-xs"
          >
            Encrypt Video
          </Button>
        </div>
        
        <div className="mt-8">
          <StatusBox>{status}</StatusBox>
        </div>
      </div>
    </div>
  );
}

export default EncryptVideo;