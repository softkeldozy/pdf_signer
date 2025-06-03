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

import SignatureToolbar from "./components/SignatureToolbar";
import TransactionTimeline from "./components/TransactionTimeline";
// import SignatureOverlay from "./components/SignatureOverlay";
import "../src/App.css";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);

  const [step, setStep] = useState(0);
  const { signPdf, status, signatureData, error, reset } = usePdfSigner();

  const { documents, addDocument } = useDocumentHistory();
  const [selectedDoc, setSelectedDoc] = useState(null);

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

  const handleSelectDocument = async (docId) => {
    try {
      const doc = documents.find((d) => d.id === docId);
      if (doc) {
        setSelectedDoc(doc);
        // You might want to load the document content here if needed
        // await loadDocument(docId);
      }
    } catch (err) {
      console.error("Failed to load document:", err);
    }
  };

  return (
    <div className="app-container">
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
            <div className="signed-document-link">
              <a
                href={`https://app.ethsign.xyz/sign/${signatureData.documentId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Signed Document
              </a>
            </div>
          )}

          <div className="sidebar">
            <DocumentHistory
              documents={documents}
              onSelectDocument={handleSelectDocument}
              selectedDocId={selectedDoc?.id}
            />
          </div>

          <div className="verification-section">
            <ErrorBoundary>
              <VerifySignature2
                selectedDocument={selectedDoc}
                address={address}
              />
            </ErrorBoundary>
          </div>
        </div>
      )}
    </div>
  );
}
