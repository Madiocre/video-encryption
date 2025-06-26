import { Link } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
// import { open } from '@tauri-apps/plugin-dialog';
import Button from './components/ui/Button';

function MainMenu() {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Video Encryption Tool
        </h1>
        
        <div className="flex flex-col gap-4">
          <Link to="/generate-certificate">
            <Button size="lg" className="w-full">
              Generate Certificate
            </Button>
          </Link>
          
          <Link to="/encrypt-video">
            <Button size="lg" className="w-full">
              Encrypt Video
            </Button>
          </Link>
          
          <Link to="/generate-access-key">
            <Button size="lg" className="w-full">
              Generate Access Key
            </Button>
          </Link>
          
          <div className="mt-8 border-t pt-6">
            <Button
              variant="danger"
              className="w-full"
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