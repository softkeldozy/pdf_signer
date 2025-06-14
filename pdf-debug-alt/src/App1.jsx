import { useState, useRef, useEffect, useCallback } from "react";
import WalletButton from "./components/WalletButton";
import FileDropzone from "./components/FileDropZone";
import PdfPreview from "./components/PdfPreview";
import usePdfSigner2 from "./hooks/usePdfSigner2";
import useDocumentHistory from "./hooks/useDocumentHistory";
import DocumentHistory from "./components/DocumentHistory";
import TransactionTimeline from "./components/TransactionTimeline";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import VerifyDocument from "./components/VerifyDocument";
import useDocumentStore from "./hooks/store/documentStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

export default function App1() {
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const pdfContainerRef = useRef(null);

  // Document history
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
  // Validate file before passing to hook
  const getValidatedFile = useCallback(() => {
    if (!file) return null;

    if (!(file instanceof File)) {
      console.error("Invalid file object:", file);
      return null;
    }

    const isPDF =
      file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
    if (!isPDF) {
      console.error("Invalid file type - Only PDF files are supported");
      return null;
    }

    if (file.size > 10 * 1024 * 1024) {
      console.error("File too large (max 10MB)");
      return null;
    }

    return file;
  }, [file]);

  const validatedFile = getValidatedFile();

  // PDF Signer Hook
  const {
    prepareDocument,
    signPdf,
    status,
    signatureData,
    error,
    reset,
    documentPreview,
    isSdkInitializing,
  } = usePdfSigner2({
    file: validatedFile,
    walletAddress: address,
    metadata: {},
  });

  // Handle wallet connection
  const getCurrentWalletAddress = useCallback(async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        return accounts[0] || null;
      } catch (err) {
        console.error("Wallet error:", err);
        return null;
      }
    }
    return null;
  }, []);

  const fetchDocuments = useDocumentStore((state) => state.fetchDocuments);

  const handleFileAccepted = async (file) => {
    if (!file) {
      setFile(null);
      reset();
      return;
    }

    setFile(file);
    try {
      const result = await signPdf(file, address, fetchDocuments);
      addDocument({
        id: result.documentId,
        name: file.name,
        txHash: result.transactionHash,
      });

      // Clear file after successful sign
      setFile(null);
    } catch (err) {
      toast.error("Signing failed:", err);

      // ✅ Check for user rejection
      if (
        err.message?.includes("user rejected") ||
        err.message?.includes("User rejected") ||
        err.code === 4001
      ) {
        toast.error("You rejected the transaction signing.");
        // ✅ Clear file after failed sign
        setFile(null);
      } else {
        toast.error(`Signing failed: ${err.message}`);
        // Clear file after failed sign
        setFile(null);
      }
    }
  };

  const isReadyToSign =
    status === "ready_for_approval" &&
    !isSdkInitializing &&
    address &&
    validatedFile;

  // Debug logging
  useEffect(() => {
    console.log("Current signing state:", {
      status,
      isSdkInitializing,
      file: file?.name,
      address,
      error,
      isReadyToSign,
    });
  }, [status, isSdkInitializing, file, address, error, isReadyToSign]);

  const isWalletConnected =
    address && typeof address === "string" && address.length > 0;

  // Sign document handler
  const handleSignDocument = useCallback(async () => {
    console.log("Sign button clicked - verification"); // Debug log

    if (!isReady) {
      console.warn("Signing prevented - requirements not met");
      return;
    }

    try {
      const currentAddress = await getCurrentWalletAddress();
      if (
        !currentAddress ||
        currentAddress.toLowerCase() !== address.toLowerCase()
      ) {
        throw new Error("Connected wallet mismatch");
      }

      const result = await signPdf(validatedFile, address, {
        signingTimestamp: new Date().toISOString(),
        signatureType: "contract",
        signatureVersion: "1.0",
      });

      addDocument({
        id: result.documentId,
        name: validatedFile.name,
        txHash: result.transactionHash,
        timestamp: new Date().toISOString(),
        signer: address,
      });

      return result;
    } catch (error) {
      console.error("Signing failed:", error);
      throw error;
    }
  }, [
    validatedFile,
    address,
    isSdkInitializing,
    signPdf,
    getCurrentWalletAddress,
    addDocument,
  ]);

  return (
    <div className="app-container">
      <div className="card-container">
        <h2>
          <Header />
        </h2>
        <WalletButton
          isConnected={isConnected}
          address={address}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </div>
      <div>
        {/* User rejecting signing of pdf */}
        <ToastContainer position="top-right" autoClose={7000} />
      </div>
      {isConnected && (
        <div className="main-content">
          <FileDropzone
            onFileAccepted={handleFileAccepted}
            disabled={!isConnected || isSdkInitializing}
          />

          {file && (
            <div className="preview-card" ref={pdfContainerRef}>
              <h3>Document Preview</h3>
              {documentPreview ? (
                <iframe
                  src={documentPreview}
                  title="PDF Preview"
                  style={{ width: "100%", height: "500px", border: "none" }}
                />
              ) : (
                <PdfPreview file={file} />
              )}

              {/* {error && <div className="error-message">{error.message}</div>} */}
            </div>
          )}
          {isSdkInitializing && (
            <TransactionTimeline
              currentStep={status === "signing" ? 1 : 0}
              steps={["PDF Uploaded", "Signing", "Completed"]}
            />
          )}
          <DocumentHistory
            onSelectDocument={(docId) => {
              const doc = documents.find((d) => d.id === docId);
              if (doc) setSelectedDoc(doc);
            }}
            selectedDocId={selectedDoc?.id}
          />

          <ErrorBoundary>
            <VerifyDocument selectedDocument={selectedDoc} address={address} />
          </ErrorBoundary>
          <div className=""></div>
        </div>
      )}
    </div>
  );
}
