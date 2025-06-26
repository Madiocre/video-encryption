// src/GenerateAccessKey.tsx
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCopy, FaPaste } from "react-icons/fa";
import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";

function GenerateAccessKey() {
  const [accessKey, setAccessKey] = useState("");
  const [accessCert, setAccessCert] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

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
    <div className="container mx-auto p-4 max-w-4xl sm:p-6 md:p-8">
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center text-lg hover:text-blue-500"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      <h2 className="text-xl mb-2 font-semibold">Generate Access Key</h2>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Key identifier"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />
        <button
          onClick={pasteKeyIdentifier}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          title="Paste from clipboard"
        >
          <FaPaste />
        </button>
      </div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Certificate path (.p12)"
          value={accessCert}
          onChange={(e) => setAccessCert(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={() => pickFile(setAccessCert, ["p12"])}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Browse
        </button>
      </div>
      <input
        type="password"
        placeholder="Password"
        value={accessPassword}
        onChange={(e) => setAccessPassword(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <button
        onClick={generateAccessKey}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mb-2"
      >
        Generate Access Key
      </button>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Generated access key"
          value={result}
          readOnly
          className="border p-2 flex-1 rounded bg-gray-100"
        />
        <button
          onClick={copyAccessKey}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          title="Copy to clipboard"
        >
          <FaCopy />
        </button>
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Status:</h3>
        <p>{status}</p>
      </div>
    </div>
  );
}

export default GenerateAccessKey;
