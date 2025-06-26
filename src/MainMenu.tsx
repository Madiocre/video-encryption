// src/MainMenu.tsx
import { Link } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
// import { open } from '@tauri-apps/plugin-dialog';

function MainMenu() {
  return (
    <div className="container mx-auto p-4 max-w-4xl sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Video Encryption Tool</h1>
      <div className="flex flex-col space-y-4">
        <Link to="/generate-certificate">
          <button className="bg-blue-500 text-white p-2 w-full text-lg hover:bg-blue-600">
            Generate Certificate
          </button>
        </Link>
        <Link to="/encrypt-video">
          <button className="bg-blue-500 text-white p-2 w-full text-lg hover:bg-blue-600">
            Encrypt Video
          </button>
        </Link>
        <Link to="/generate-access-key">
          <button className="bg-blue-500 text-white p-2 w-full text-lg hover:bg-blue-600">
            Generate Access Key
          </button>
        </Link>
        <button
          className="bg-red-500 text-white p-2 w-full text-lg md:block hidden hover:bg-red-600"
          onClick={() => invoke('close_app')}
        >
          Close App
        </button>
      </div>
    </div>
  );
}

export default MainMenu;