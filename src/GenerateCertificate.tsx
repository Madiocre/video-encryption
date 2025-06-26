// src/GenerateCertificate.tsx
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function GenerateCertificate() {
  const [certPassword, setCertPassword] = useState("");
  const [certOutput, setCertOutput] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

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
    <div className="container mx-auto p-4 max-w-4xl sm:p-6 md:p-8">
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center text-lg hover:text-blue-500"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      <h2 className="text-xl mb-2 font-semibold">Generate Certificate</h2>
      <input
        type="password"
        placeholder="Password"
        value={certPassword}
        onChange={(e) => setCertPassword(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Output path (.p12)"
          value={certOutput}
          onChange={(e) => setCertOutput(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={() => pickFile(setCertOutput, "save", ["p12"])}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Browse
        </button>
      </div>
      <button
        onClick={generateCertificate}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Generate Certificate
      </button>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Status:</h3>
        <p>{status}</p>
      </div>
    </div>
  );
}

export default GenerateCertificate;
