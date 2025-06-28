import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
// import { useNavigate } from "react-router-dom";
import Button from './components/ui/Button';
import InputGroup from './components/ui/InputGroup';
import StatusBox from './components/ui/StatusBox';
import BackButton from './components/BackButton';
import { useHelp } from './contexts/HelpContext';
import { useEffect } from 'react';
import { FaKey } from 'react-icons/fa';

function GenerateCertificate() {
  const [certPassword, setCertPassword] = useState("");
  const [certOutput, setCertOutput] = useState("");
  const [status, setStatus] = useState("");
  // const navigate = useNavigate();
  const { setHelpContent } = useHelp();

  useEffect(() => {
    setHelpContent(`
      Generate a digital certificate that will be used to encrypt your videos.
      
      • Password: Create a strong password to protect your certificate
      • Output Path: Choose where to save your certificate (.p12 file)
      
      Important: Keep this certificate safe! It's required to decrypt your videos.
    `);
  }, [setHelpContent]);

  const pickFile = async (
    setter: (value: string) => void,
    mode: "open" | "save" = "open",
    extensions?: string[]
  ) => {
    try {
      let selected: string | null;
      if (mode === "open") {
        selected = await open({
          filters: extensions ? [{ name: "Files", extensions }] : undefined,
        });
      } else {
        selected = await save({
          filters: extensions ? [{ name: "Files", extensions }] : undefined,
          defaultPath: "certificate.p12", // Optional: suggest a default name
        });
      }

      if (typeof selected === "string") {
        setter(selected);
      }
    } catch (error: any) {
      console.error(`Error in ${mode} dialog:`, error);
      // Optionally, inform the user if permission is denied
      if (error.toString().includes("not allowed")) {
        console.log(
          `Permission for ${mode} dialog is not granted in Tauri config.`
        );
      }
    }
  };

  const generateCertificate = async () => {
    try {
      setStatus("Generating certificate...");
      const result = await invoke("generate_certificate", {
        password: certPassword,
        output: certOutput,
      });
      setStatus(`Certificate generated: ${result}`);
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <BackButton />
      
      <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center mb-6">
          <FaKey className="text-3xl text-blue-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Generate Certificate</h2>
        </div>
        
        <InputGroup
          label="Password"
          type="password"
          value={certPassword}
          onChange={(e) => setCertPassword(e.target.value)}
          fullWidth
        />
        
        <InputGroup
          label="Output Path (.p12)"
          value={certOutput}
          onChange={(e) => setCertOutput(e.target.value)}
          button={
            <Button
              onClick={() => pickFile(setCertOutput, "save", ["p12"])}
              className="min-w-[100px] justify-center"
            >
              Browse
            </Button>
          }
        />
        
        <div className="mt-6 flex justify-center">
          <Button
            onClick={generateCertificate}
            size="lg"
            className="w-full max-w-xs justify-center"
          >
            Generate Certificate
          </Button>
        </div>
        
        <div className="mt-8">
          <StatusBox>{status}</StatusBox>
        </div>
      </div>
    </div>
  );
}

export default GenerateCertificate;
