import { useState } from "react";
import WalletButton from "./components/WalletButton";
import FileDropzone from "./components/FileDropzone";
import PdfPreview from "./components/PdfPreview";

import SigningStatus from "./components/SigningStatus";
import usePdfSigner from "./hooks/usePdfSigner2";

import useDocumentHistory from "./hooks/useDocumentHistory";
import DocumentHistory from "./components/DocumentHistory";

import ErrorBoundary from "./components/ErrorBoundary";

import VerifySignature2 from "./components/VerifySignature2";
import "../src/App.css";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const { signPdf, status, signatureData, error, reset } = usePdfSigner();

  const { documents, addDocument } = useDocumentHistory();

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
      const result = await signPdf(file, address);
      addDocument({
        id: result.documentId,
        name: file.name,
        txHash: result.transactionHash,
      });
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
          <div className="sidebar">
            <DocumentHistory documents={documents} />
            {/* TODO try wrapping the VerifySignature here  */}
            {/* <VerifySignature /> */}
          </div>

          <ErrorBoundary>
            <div
              style={{
                margin: "20px 0",
                padding: "20px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            >
              <VerifySignature2 />
            </div>
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}
