import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
// import { useNavigate } from 'react-router-dom';
import Button from './components/ui/Button';
import InputGroup from './components/ui/InputGroup';
// import StatusBox from './components/ui/StatusBox';
import BackButton from './components/BackButton';
import { useHelp } from './contexts/HelpContext';
import { useEffect } from 'react';
import { FaLock } from 'react-icons/fa';

function EncryptVideo() {
  const [encryptCert, setEncryptCert] = useState('');
  const [encryptPassword, setEncryptPassword] = useState('');
  const [videoPath, setVideoPath] = useState('');
  const [encryptOutput, setEncryptOutput] = useState('');
  const [status, setStatus] = useState('');
  // const navigate = useNavigate();
  const { setStyledHelpContent } = useHelp();

  useEffect(() => {
    setStyledHelpContent([
      { text: "Encrypt your videos to protect them from unauthorized access.", className: "text-blue-600 font-semibold" },
      { text: "• Certificate: Select any certificate you generated earlier, the resulting encrypted video will only be accessed with this certificate", className: "text-gray-700" },
      { text: "• Password: Enter the password for your certificate", className: "text-gray-700" },
      { text: "• Video: Choose the video file to encrypt", className: "text-gray-700" },
      { text: "• Output: Specify where to save the encrypted file (.vef)", className: "text-gray-700" },
      { text: "NOTE: Users will need an access key to be able to view this video, and they can only access it from the associated app on mobile.", className: "text-red-500 font-bold" }
    ]);
  }, []);

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
    console.log(status);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <BackButton />
      
      <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center mb-6">
          <FaLock className="text-3xl text-green-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Encrypt Video</h2>
        </div>
        
        <InputGroup
          label="Certificate (.p12)"
          value={encryptCert}
          onChange={(e) => setEncryptCert(e.target.value)}
          button={
            <Button
              onClick={() => pickFile(setEncryptCert, 'open', ['p12'])}
              className="min-w-[100px] justify-center"
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
              className="min-w-[100px] justify-center"
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
              className="min-w-[100px] justify-center"
            >
              Browse
            </Button>
          }
        />
        
        <div className="mt-6 flex justify-center">
          <Button
            onClick={encryptVideo}
            size="lg"
            className="w-full max-w-xs justify-center"
          >
            Encrypt Video
          </Button>
        </div>
        
        {/* <div className="mt-8">
          <StatusBox>{status}</StatusBox>
        </div> */}
      </div>
    </div>
  );
}

export default EncryptVideo;