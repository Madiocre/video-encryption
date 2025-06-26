import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
// import { useNavigate } from "react-router-dom";
import Button from './components/ui/Button';
import InputGroup from './components/ui/InputGroup';
import StatusBox from './components/ui/StatusBox';
import BackButton from './components/BackButton';

function GenerateCertificate() {
  const [certPassword, setCertPassword] = useState("");
  const [certOutput, setCertOutput] = useState("");
  const [status, setStatus] = useState("");
  // const navigate = useNavigate();

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
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Certificate</h2>
        
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
              className="min-w-[100px]"
            >
              Browse
            </Button>
          }
        />
        
        <div className="mt-6 flex justify-center">
          <Button
            onClick={generateCertificate}
            size="lg"
            className="w-full max-w-xs"
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
