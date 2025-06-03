// import { useState, useRef, useEffect } from "react";
// import WalletButton from "./components/WalletButton";
// import FileDropzone from "./components/FileDropzone";
// import PdfPreview from "./components/PdfPreview";
// import SigningStatus from "./components/SigningStatus";
// import usePdfSigner2 from "./hooks/usePdfSigner2";
// import useDocumentHistory from "./hooks/useDocumentHistory";
// import DocumentHistory from "./components/DocumentHistory";
// import TransactionTimeline from "./components/TransactionTimeline";
// import ErrorBoundary from "./components/ErrorBoundary";
// import VerifySignature2 from "./components/VerifySignature2";
// import "./App.css";

// export default function App() {
//   // State
//   const [isConnected, setIsConnected] = useState(false);
//   const [address, setAddress] = useState("");
//   const [file, setFile] = useState(null);
//   const [selectedDoc, setSelectedDoc] = useState(null);
//   const [signingState, setSigningState] = useState({
//     isReady: false,
//     isSigning: false,
//     error: null,
//   });

//   const getCurrentWalletAddress = async () => {
//     if (window.ethereum) {
//       try {
//         const accounts = await window.ethereum.request({
//           method: "eth_accounts",
//         });
//         return accounts[0] || null;
//       } catch (err) {
//         console.error("Wallet error:", err);
//         return null;
//       }
//     }
//     return null;
//   };

//   // Validate file before passing to hook
//   const getValidatedFile = useCallback(() => {
//     if (!file) return null;

//     // Basic file validation
//     if (!(file instanceof File)) {
//       console.error("Invalid file object:", file);
//       return null;
//     }
//     // Check file type
//     const isPDF =
//       file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
//     if (!isPDF) {
//       console.error("Invalid file type - Only PDF files are supported");
//       return null;
//     }

//     // Check file size (e.g., 10MB limit)
//     if (file.size > 10 * 1024 * 1024) {
//       console.error("File too large (max 10MB)");
//       return null;
//     }

//     return file;
//   }, [file]);

//   // Handle file selection with validation
//   const handleFileChange = useCallback(
//     async (selectedFile) => {
//       if (!selectedFile) {
//         setFile(null);
//         reset();
//         return;
//       }

//       // Immediate validation feedback
//       if (
//         !selectedFile.type.includes("pdf") &&
//         !selectedFile.name.toLowerCase().endsWith(".pdf")
//       ) {
//         alert("Please select a PDF file");
//         return;
//       }

//       if (selectedFile.size > 10 * 1024 * 1024) {
//         alert("File size must be less than 10MB");
//         return;
//       }

//       try {
//         setFile(selectedFile);
//         await prepareDocument(selectedFile);
//       } catch (err) {
//         console.error("Error preparing document:", err);
//         setFile(null);
//       }
//     },
//     [prepareDocument, reset]
//   );

//   const pdfContainerRef = useRef(null);
//   const {
//     prepareDocument,
//     signPdf,
//     status,
//     signatureData,
//     error,
//     reset,
//     documentPreview,
//     isSdkInitializing,
//   } = usePdfSigner2({
//     file: validatedFile,
//     walletAddress: getCurrentWalletAddress, // Fetching address
//     metadata: {}, // Add any metadata you need
//   });

//   // Adding validation before using the hook's functions
//   const safeSignPdf = useCallback(async () => {
//     if (!file || !address) {
//       console.error("Missing required parameters for signing");
//       return;
//     }
//     return signPdf(file, address, {
//       signingTimestamp: new Date().toISOString(),
//       signatureType: "contract",
//       signatureVersion: "1.0",
//     });
//   }, [file, address, signPdf]);

//   const { documents, addDocument } = useDocumentHistory();

//   useEffect(() => {
//     console.log("Current signing state:", {
//       status,
//       isSigning,
//       file: file?.name,
//       address,
//       error,
//     });
//   }, [status, isSigning, file, address, error]);

//   // Handle file acceptance
//   const handleFileAccepted = async (file) => {
//     if (!file) {
//       setFile(null);
//       reset();
//       return;
//     }

//     try {
//       setFile(file);
//       await prepareDocument(file);
//     } catch (err) {
//       console.error("Error preparing document:", err);
//       setFile(null);
//     }
//   };
//   // Consolidated handler for PDF readiness
//   const handlePdfReady = useCallback((isReady) => {
//     setSigningState((prev) => ({
//       ...prev,
//       isReady,
//       error: isReady ? null : prev.error,
//     }));
//   }, []);

//   // Signing Document
//   // Use useCallback with all dependencies
//   const handleSignDocument = useCallback(async () => {
//     console.log("Sign button was actually clicked!"); // Debug log

//     if (!file || !address || signingState.isSigning) {
//       console.warn("Prevented signing due to missing requirements");
//       return;
//     }

//     try {
//       setSigningState((prev) => ({ ...prev, isSigning: true, error: null }));

//       const accounts = await window.ethereum.request({
//         method: "eth_accounts",
//       });
//       if (!accounts[0] || accounts[0].toLowerCase() !== address.toLowerCase()) {
//         throw new Error("Please connect with the correct wallet");
//       }

//       const result = await signPdf(file, address, {
//         signingTimestamp: new Date().toISOString(),
//         signatureType: "contract",
//         signatureVersion: "1.0",
//       });

//       addDocument({
//         id: result.documentId,
//         name: file.name,
//         txHash: result.transactionHash,
//         timestamp: new Date().toISOString(),
//         signer: address,
//       });

//       return result;
//     } catch (error) {
//       console.error("Signing error:", error);
//       setSigningState((prev) => ({ ...prev, error: error.message }));
//       throw error;
//     } finally {
//       setSigningState((prev) => ({ ...prev, isSigning: false }));
//     }
//   }, [file, address, signPdf, addDocument, signingState.isSigning]); // All dependencies

//   // Determine if ready to sign
//   // Debug effect to track unwanted calls
//   useEffect(() => {
//     const handler = () => {
//       console.trace("Unexpected handleSignDocument call detected!");
//     };

//     // This will log if the function is called unexpectedly
//     if (process.env.NODE_ENV === "development") {
//       const original = handleSignDocument;
//       handleSignDocument = (...args) => {
//         handler();
//         return original(...args);
//       };
//     }
//   }, [handleSignDocument]);

//   const isReadyToSign =
//     status === "ready_for_approval" && !isSdkInitializing && address && file;

//   return (
//     <div className="app-container">
//       <h1>PDF Signing DApp</h1>

//       <WalletButton
//         isConnected={isConnected}
//         address={address}
//         onConnect={(addr) => {
//           setIsConnected(true);
//           setAddress(addr);
//           reset();
//         }}
//         onDisconnect={() => {
//           setIsConnected(false);
//           setAddress("");
//           setFile(null);
//           reset();
//         }}
//       />

//       {isConnected && (
//         <div className="main-content">
//           <FileDropzone
//             onFileAccepted={handleFileAccepted}
//             disabled={!isConnected || isSdkInitializing}
//           />

//           {file && (
//             <div className="pdf-preview-container" ref={pdfContainerRef}>
//               {documentPreview ? (
//                 <iframe
//                   src={documentPreview}
//                   style={{ width: "100%", height: "500px" }}
//                   title="PDF Preview"
//                 />
//               ) : (
//                 <PdfPreview
//                   file={file}
//                   onLoadSuccess={() => setIsReadyToSign(true)}
//                   onLoadError={() => setIsReadyToSign(false)}
//                 />
//               )}

//               <SigningStatus
//                 txHash={signatureData?.transactionHash}
//                 isReady={signingState.isReady}
//                 isLoading={signingState.isSigning}
//                 onSignClick={React.memo(
//                   () => handleSignDocument,
//                   [
//                     file?.name,
//                     address,
//                     signingState.isReady,
//                     signingState.isSigning,
//                   ]
//                 )}
//               />

//               {signingState.error && (
//                 <div className="error-message">{signingState.error}</div>
//               )}
//             </div>
//           )}

//           {isSigning && (
//             <TransactionTimeline
//               currentStep={1}
//               steps={["PDF Uploaded", "Signing", "Completed"]}
//             />
//           )}

//           {signatureData && (
//             <a
//               href={`https://app.ethsign.xyz/sign/${signatureData.documentId}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="signed-document-link"
//             >
//               View Signed Document
//             </a>
//           )}

//           <div className="sidebar">
//             <DocumentHistory
//               documents={documents}
//               onSelectDocument={(docId) => setSelectedDoc(docId)}
//               selectedDocId={selectedDoc}
//             />
//           </div>

//           <div className="verification-section">
//             <ErrorBoundary>
//               <VerifySignature2
//                 selectedDocument={selectedDoc}
//                 address={address}
//               />
//             </ErrorBoundary>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useRef, useEffect, useCallback } from "react";
import WalletButton from "./components/WalletButton";
import FileDropzone from "./components/FileDropzone";
import PdfPreview from "./components/PdfPreview";
import SigningStatus from "./components/SigningStatus";
import usePdfSigner2 from "./hooks/usePdfSigner2";
import useDocumentHistory from "./hooks/useDocumentHistory";
import DocumentHistory from "./components/DocumentHistory";
import TransactionTimeline from "./components/TransactionTimeline";
import ErrorBoundary from "./components/ErrorBoundary";
import VerifySignature2 from "./components/VerifySignature2";
import "./App.css";

export default function App() {
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const pdfContainerRef = useRef(null);

  // Document history
  const { documents, addDocument } = useDocumentHistory();

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

  // Handle file acceptance with validation
  const handleFileAccepted = useCallback(
    async (selectedFile) => {
      if (!selectedFile) {
        setFile(null);
        reset();
        return;
      }

      // Immediate validation feedback
      if (
        !selectedFile.type.includes("pdf") &&
        !selectedFile.name.toLowerCase().endsWith(".pdf")
      ) {
        alert("Please select a PDF file");
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      try {
        setFile(selectedFile);
        await prepareDocument(selectedFile);
      } catch (err) {
        console.error("Error preparing document:", err);
        setFile(null);
      }
    },
    [prepareDocument, reset]
  );

  // Determine if ready to sign
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

  const isReady = useMemo(() => {
    return validatedFile && isWalletConnected && !isSdkInitializing;
  }, [validatedFile, isWalletConnected, isSdkInitializing]);

  // Sign document handler
  const handleSignDocument = useCallback(async () => {
    console.log("Sign button clicked - verification"); // Debug log

    // if (!validatedFile || !address || isSdkInitializing) {
    //   console.warn("Signing prevented - missing requirements");
    //   return;
    // }

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
      <h1>PDF Signing DApp</h1>

      <WalletButton
        isConnected={isConnected}
        address={address}
        onConnect={(addr) => {
          setIsConnected(true);
          setAddress(addr);
          reset();
        }}
        onDisconnect={() => {
          setIsConnected(false);
          setAddress("");
          setFile(null);
          reset();
        }}
      />

      {isConnected && (
        <div className="main-content">
          <FileDropzone
            onFileAccepted={handleFileAccepted}
            disabled={!isConnected || isSdkInitializing}
          />

          {file && (
            <div className="pdf-preview-container" ref={pdfContainerRef}>
              {documentPreview ? (
                <iframe
                  src={documentPreview}
                  style={{ width: "100%", height: "500px" }}
                  title="PDF Preview"
                />
              ) : (
                <PdfPreview
                  file={file}
                  onLoadSuccess={() => {}}
                  onLoadError={() => {}}
                />
              )}

              <SigningStatus
                isReady={isReady}
                isLoading={isSigning}
                address={address}
                txHash={signatureData?.transactionHash}
                isReadyToSign={isReadyToSign}
                //
                onSignClick={() => {
                  handleSignDocument();
                }}
                // isLoading={isSdkInitializing}
              />

              {error && <div className="error-message">{error.message}</div>}
            </div>
          )}

          {isSdkInitializing && (
            <TransactionTimeline
              currentStep={status === "signing" ? 1 : 0}
              steps={["PDF Uploaded", "Signing", "Completed"]}
            />
          )}

          {signatureData && (
            <a
              href={`https://app.ethsign.xyz/sign/${signatureData.documentId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="signed-document-link"
            >
              View Signed Document
            </a>
          )}

          <div className="sidebar">
            <DocumentHistory
              documents={documents}
              onSelectDocument={(docId) => {
                const doc = documents.find((d) => d.id === docId);
                if (doc) setSelectedDoc(doc);
              }}
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
