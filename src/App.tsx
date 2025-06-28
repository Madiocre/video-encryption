import { HashRouter, Routes, Route } from 'react-router-dom';
import MainMenu from './MainMenu';
import GenerateCertificate from './GenerateCertificate';
import EncryptVideo from './EncryptVideo';
import GenerateAccessKey from './GenerateAccessKey';
import './App.css';
import HelpButton from './components/HelpSystem/HelpButton';
import HelpModal from './components/HelpSystem/HelpModal';
import { useState } from 'react';
import { HelpProvider } from './contexts/HelpContext';

function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <HelpProvider>
      <div className="min-h-screen">
        {/* Help System */}
        <HelpButton onClick={() => setIsHelpOpen(true)} />
        <HelpModal 
          isOpen={isHelpOpen} 
          onClose={() => setIsHelpOpen(false)}
        />

        <HashRouter>
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/generate-certificate" element={<GenerateCertificate />} />
            <Route path="/encrypt-video" element={<EncryptVideo />} />
            <Route path="/generate-access-key" element={<GenerateAccessKey />} />
          </Routes>
        </HashRouter>
      </div>
    </HelpProvider>
  );
}

export default App;