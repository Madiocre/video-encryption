import { Link } from 'react-router-dom';
import Button from './components/ui/Button';
import { useHelp } from './contexts/HelpContext';
import { useEffect } from 'react';
import { FaKey, FaLock, FaHandshake } from 'react-icons/fa';
import { invoke } from '@tauri-apps/api/core';

function MainMenu() {
  const { setHelpContent } = useHelp();

  useEffect(() => {
    setHelpContent(`
      Welcome to the Video Encryption Tool! This application helps you secure your videos with end-to-end encryption.
      
      • Generate Certificate: Create a digital certificate for encryption
      • Encrypt Video: Protect your videos using your certificate
      • Generate Access Key: Create keys to share access to encrypted videos
    `);
  }, [setHelpContent]);

  return (
    <div className="container mx-auto p-4 max-w-xl"> {/* Increased to max-w-xl */}
      <div className="bg-white rounded-xl shadow-sm p-8 transition-all duration-300 hover:shadow-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Video Encryption Tool
          </h1>
          {/* <div className="flex items-center">
            <span className="mr-3 text-sm text-gray-500">v1.0</span>
            <button
              onClick={() => invoke('close_app')}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Close app"
            >
              <FaTimesCircle className="text-xl" />
            </button>
          </div> */}
        </div>
        
        <div className="flex flex-col gap-5"> {/* Increased gap */}
          <Link to="/generate-certificate">
            <Button size="lg" className="w-full flex items-center group">
              <div className="w-12 h-12 flex items-center justify-center mr-4">
                <FaKey className="text-2xl text-blue-500 group-hover:text-blue-400 transition-colors group-hover-animate-key" />
              </div>
              <span className="text-lg font-medium">Generate Certificate</span>
            </Button>
          </Link>
          
          <Link to="/encrypt-video">
            <Button size="lg" className="w-full flex items-center group">
              <div className="w-12 h-12 flex items-center justify-center mr-4">
                <FaLock className="text-2xl text-green-500 group-hover:text-green-400 transition-colors group-hover-animate-lock" />
              </div>
              <span className="text-lg font-medium">Encrypt Video</span>
            </Button>
          </Link>
          
          <Link to="/generate-access-key">
            <Button size="lg" className="w-full flex items-center group">
              <div className="w-12 h-12 flex items-center justify-center mr-4">
                <FaHandshake className="text-2xl text-purple-500 group-hover:text-purple-400 transition-colors group-hover-animate-handshake" />
              </div>
              <span className="text-lg font-medium">Generate Access Key</span>
            </Button>
          </Link>
          
          <div className="mt-8 border-t pt-6">
            <Button
              variant="danger"
              className="w-full justify-center"
              onClick={() => invoke('close_app')}
            >
              Close App
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;