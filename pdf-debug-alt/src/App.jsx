import { useState } from "react";
import WalletButton from "./components/WalletButton";
import FileDropzone from "./components/FileDropzone";
import PdfPreview from "./components/PdfPreview";

import SigningStatus from "./components/SigningStatus";
import usePdfSigner from "./hooks/usePdfSigner2";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const { signPdf, status, signatureData, error, reset } = usePdfSigner();

  // Safe connection handler
  const handleConnect = (addr) => {
    try {
      if (!addr) throw new Error("Invalid address received");
      setIsConnected(true);
      setAddress(addr);
      reset();
    } catch (err) {
      console.error("Connection handler error:", err);
      setIsConnected(false);
      setAddress("");
    }
  };

  // Safe disconnect handler
  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress("");
    setFile(null);
    reset();
  };

  const handleFileAccepted = async (file) => {
    if (!file) {
      setFile(null);
      reset();
      return;
    }

    setFile(file);
    try {
      await signPdf(file, address);
    } catch (err) {
      console.error("Signing failed:", err);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#333" }}>PDF Signing DApp</h1>

      <WalletButton
        isConnected={isConnected}
        address={address}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      {isConnected && (
        <div style={{ marginTop: "30px" }}>
          <FileDropzone
            onFileAccepted={handleFileAccepted}
            disabled={!isConnected}
          />
          {file && <PdfPreview file={file} />}

          <SigningStatus status={status} file={file} />

          {signatureData && (
            <div style={{ marginTop: "20px" }}>
              <a
                href={`https://app.ethsign.xyz/sign/${signatureData.documentId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  background: "#4caf50",
                  color: "white",
                  borderRadius: "4px",
                  textDecoration: "none",
                }}
              >
                View Signed Document
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
