import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
// import { useNavigate } from "react-router-dom";
import { FaCopy, FaPaste } from "react-icons/fa";
import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";
import Button from './components/ui/Button';
import InputGroup from './components/ui/InputGroup';
// import StatusBox from './components/ui/StatusBox';
import BackButton from './components/BackButton';
import { useHelp } from './contexts/HelpContext';
import { useEffect } from 'react';
import { FaHandshake } from 'react-icons/fa';

function GenerateAccessKey() {
  const [accessKey, setAccessKey] = useState("");
  const [accessCert, setAccessCert] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  // const navigate = useNavigate();
  const { setStyledHelpContent } = useHelp();

  useEffect(() => {
    setStyledHelpContent([
      { text: "Generate access keys to share encrypted videos securely.", className: "text-blue-600 font-semibold" },
      { text: "• Key Identifier: This will be sent to you by the person requesting access to the video", className: "text-gray-700" },
      { text: "• Certificate: Your encryption certificate", className: "text-gray-700" },
      { text: "• Password: Certificate password", className: "text-gray-700" },
      { text: "• Generated Access Key: You send this back to the user to grant them permission to view the video", className: "text-gray-700" },
      { text: "NOTE: This gives the ability to open any video that is stored on the certificate, they can only view the video file if sent to them.", className: "text-red-500 font-bold" }
    ]);
  }, []);
  const pickFile = async (
    setter: (value: string) => void,
    extensions?: string[]
  ) => {
    const selected = await open({
      filters: extensions ? [{ name: "Files", extensions }] : undefined,
    });
    if (typeof selected === "string") {
      setter(selected);
    }
  };

  const generateAccessKey = async () => {
    try {
      setStatus("Generating access key...");
      const result = await invoke("generate_access_key", {
        key: accessKey,
        certificate: accessCert,
        password: accessPassword,
      });
      setStatus(`Access key generated`);
      setResult(`${result}`);
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
    console.log(status);
  };

  const copyAccessKey = async () => {
    try {
      await writeText(result);
      setStatus("Access key copied to clipboard");
    } catch (error) {
      setStatus(`Failed to copy access key`);
    }
  };

  const pasteKeyIdentifier = async () => {
    try {
      const clipboardText = await readText();
      setAccessKey(clipboardText);
      setStatus('Key identifier pasted from clipboard');
    } catch (error) {
      setStatus('Failed to paste key identifier');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <BackButton />
      
      <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center mb-6">
          <FaHandshake className="text-3xl text-purple-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Generate Access Key</h2>
        </div>
        
        <InputGroup
          label="Key Identifier"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          button={
            <Button
              onClick={pasteKeyIdentifier}
              variant="secondary"
              className="min-w-[60px] justify-center"
              title="Paste from clipboard"
            >
              <FaPaste />
            </Button>
          }
        />
        
        <InputGroup
          label="Certificate (.p12)"
          value={accessCert}
          onChange={(e) => setAccessCert(e.target.value)}
          button={
            <Button
              onClick={() => pickFile(setAccessCert, ["p12"])}
              className="min-w-[100px] justify-center"
            >
              Browse
            </Button>
          }
        />
        
        <InputGroup
          label="Password"
          type="password"
          value={accessPassword}
          onChange={(e) => setAccessPassword(e.target.value)}
        />
        
        <div className="mt-6 flex justify-center">
          <Button
            onClick={generateAccessKey}
            size="lg"
            className="w-full max-w-xs justify-center"
          >
            Generate Access Key
          </Button>
        </div>
        
        <div className="mt-8">
          <InputGroup
            label="Generated Access Key"
            value={result}
            readOnly
            button={
              <Button
                onClick={copyAccessKey}
                variant="secondary"
                className="min-w-[60px] justify-center"
                title="Copy to clipboard"
              >
                <FaCopy />
              </Button>
            }
          />
        </div>
        
        {/* <div className="mt-6">
          <StatusBox>{status}</StatusBox>
        </div> */}
      </div>
    </div>
  );
}

export default GenerateAccessKey;
