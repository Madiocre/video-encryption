
// src/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainMenu from './MainMenu';
import GenerateCertificate from './GenerateCertificate';
import EncryptVideo from './EncryptVideo';
import GenerateAccessKey from './GenerateAccessKey';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/generate-certificate" element={<GenerateCertificate />} />
        <Route path="/encrypt-video" element={<EncryptVideo />} />
        <Route path="/generate-access-key" element={<GenerateAccessKey />} />
      </Routes>
    </HashRouter>
  );
}

export default App;