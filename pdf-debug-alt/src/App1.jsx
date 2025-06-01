// import { useState, useRef } from "react";
// import WalletButton from "./components/WalletButton";
// import FileDropzone from "./components/FileDropzone";
// import PdfPreview from "./components/PdfPreview";
// import SigningStatus from "./components/SigningStatus";
// import usePdfSigner from "./hooks/usePdfSigner2";
// import useDocumentHistory from "./hooks/useDocumentHistory";
// import DocumentHistory from "./components/DocumentHistory";
// import ErrorBoundary from "./components/ErrorBoundary";
// import VerifySignature2 from "./components/VerifySignature2";
// import SignatureToolbar from "./components/SignatureToolbar";
// import TransactionTimeline from "./components/TransactionTimeline";
// import SignatureOverlay from "./components/SignatureOverlay";
// const { signPdf, captureSignature } = usePdfSigner();
// const [positions, setPositions] = useState([]);
// import "../src/App.css";

// export default function App() {
//   // Existing state
//   const [isConnected, setIsConnected] = useState(false);
//   const [address, setAddress] = useState("");
//   const [file, setFile] = useState(null);
//   const { signPdf, status, signatureData, error, reset } = usePdfSigner();
//   const { documents, addDocument } = useDocumentHistory();
//   const [selectedDoc, setSelectedDoc] = useState(null);

//   // New signature state
//   const [signingStep, setSigningStep] = useState(0);
//   const [signatureColor, setSignatureColor] = useState("#000000");
//   const pdfContainerRef = useRef(null);

//   const [pdfReady, setPdfReady] = useState(false); // Add this with your other state declarations
//   const [showSignButton, setShowSignButton] = useState(false);

//   // Existing handlers (unchanged)
//   const handleConnect = (addr) => {
//     try {
//       if (!addr) throw new Error("Invalid address received");
//       setIsConnected(true);
//       setAddress(addr);
//       reset();
//     } catch (err) {
//       console.error("Connection handler error:", err);
//       setIsConnected(false);
//       setAddress("");
//     }
//   };

//   const handleDisconnect = () => {
//     setIsConnected(false);
//     setAddress("");
//     setFile(null);
//     reset();
//     setSigningStep(0); // Reset signing flow
//   };

//   // Modified file handler
//   const handleFileAccepted = async (file) => {
//     if (!file) {
//       //   setFile(null);
//       //   reset();
//       //   return;
//       // }

//       // setFile(file);
//       // setSigningStep(1); // Ready for signing
//       setPdfReady(false);
//       setShowSignButton(false);
//       setFile(file);

//       try {
//         // Store the result to use its properties
//         const result = await signPdf(file, address);
//         addDocument({
//           id: result.documentId,
//           name: file.name,
//           txHash: result.transactionHash,
//           signatureImage: result.signatureImage,
//           positions: result.positions,
//         });
//         // Only progress to signing if no automatic signing happens
//         if (!result.signature) {
//           setSigningStep(1);
//         }
//       } catch (err) {
//         console.error("Signing failed:", err);
//         setSigningStep(1); // Reset on error
//       }
//     }

//     // effect to handle button visibility
//     useEffect(() => {
//       if (pdfReady && file && !showSignButton) {
//         setShowSignButton(true);
//       }
//     }, [pdfReady, file, showSignButton]);

//     // New signature handler
//     // const handleFinalizeSignature = async () => {
//     //   try {
//     //     setSigningStep(2); // Signing in progress

//     //     // Your existing signing logic happens here automatically
//     //     // via usePdfSigner hook when file is set

//     //     // When signatureData appears, we progress to step 3
//     //   } catch (err) {
//     //     console.error("Signature finalization failed:", err);
//     //     setSigningStep(1); // Return to signing ready state
//     //   }
//     // };
//     const handleDrawingComplete = (newPositions) => {
//       setPositions(newPositions);
//     };
//     const handleFinalizeSignature = async () => {
//       try {
//         setSigningStep(2); // Signing in progress
//         setStatus("signing");

//         // 1. Capture the canvas signature as image
//         const canvas = document.getElementById("signature-canvas");
//         const signatureImage = canvas.toDataURL("image/png");

//         // 2. Capture signature data
//         captureSignature(positions, signatureImage);

//         // 4. Prepare metadata
//         const signingTimestamp = new Date().toISOString();
//         const pdfHash = await hashPdf(file); // Implement this helper function

//         // 5. Call smart contract
//         const tx = await signPdf(file, address, {
//           signatureImage,
//           signingTimestamp,
//           pdfHash,
//           signatureType: "handwritten",
//           signatureVersion: "1.0",
//           documentHash: await hashPdf(file),
//         });

//         // 6. Wait for blockchain confirmation
//         await tx.wait();

//         // 7. Update document history
//         addDocument({
//           id: tx.hash, // Using tx hash as temporary ID
//           name: file.name,
//           txHash: tx.hash,
//           signatureImage,
//           timestamp: signingTimestamp,
//         });

//         const handleSign = async () => {
//           const canvas = document.getElementById("signature-canvas");
//           const imageData = canvas.toDataURL("image/png");

//           // Capture drawn positions (from your mouse events)
//           captureSignature(positions, imageData);

//           // Sign with metadata
//           await signPdf(file, address, {
//             customField: "value",
//             // ...other metadata
//           });
//         };

//         // Progress will automatically advance to step 3 via useEffect
//         // when signatureData is populated by usePdfSigner hook
//       } catch (err) {
//         console.error("Signature finalization failed:", err);
//         setStatus("error");
//         setSigningStep(1); // Return to signing ready state
//       }
//     };

//     // Effect to auto-advance when signature is complete
//     useEffect(() => {
//       if (signatureData && signingStep === 2) {
//         setSigningStep(3); // Signature complete
//       }
//     }, [signatureData, signingStep]);

//     return (
//       <div className="app-container">
//         <h1>PDF Signing DApp</h1>

//         <WalletButton
//           isConnected={isConnected}
//           address={address}
//           onConnect={handleConnect}
//           onDisconnect={handleDisconnect}
//         />

//         {isConnected && (
//           <div className="main-content">
//             {/* File Dropzone (unchanged) */}
//             <FileDropzone
//               onFileAccepted={handleFileAccepted}
//               disabled={!isConnected}
//             />

//             {/* PDF Preview with Signature Overlay */}
//             {file && (
//               <div className="pdf-preview-container" ref={pdfContainerRef}>
//                 <PdfPreview
//                   file={file}
//                   onLoadSuccess={() => {
//                     setPdfReady(true);
//                     setStatus("ready-to-sign");
//                   }}
//                   onLoadError={() => {
//                     setPdfReady(false);
//                     console.error("PDF loading failed:", err);
//                     setStatus("load-error");
//                   }}
//                 />
//                 {showSignButton && signingStep === 0 && (
//                   <div className="sign-action-button">
//                     <button
//                       onClick={() => setSigningStep(1)}
//                       className="primary-button"
//                     >
//                       {status === "signing" ? (
//                         <span className="flex items-center">
//                           <Spinner size="small" /> Processing...
//                         </span>
//                       ) : (
//                         "Start Signing Process"
//                       )}
//                     </button>
//                   </div>
//                 )}

//                 {signingStep >= 1 && (
//                   <SignatureOverlay
//                     color={signatureColor}
//                     onDrawingComplete={handleDrawingComplete}
//                   />
//                 )}
//                 {/* {signingStep >= 1 && (
//                 <SignatureOverlay
//                   color={signatureColor}
//                   enabled={signingStep === 1}
//                 />
//               )} */}
//               </div>
//             )}

//             {/* Signature Controls */}
//             {file && signingStep >= 1 && (
//               <div className="signature-controls">
//                 <ErrorBoundary>
//                   <SignatureToolbar
//                     onSign={handleFinalizeSignature}
//                     onClear={() => setSigningStep(1)}
//                     onColorChange={setSignatureColor}
//                     disabled={signingStep !== 1}
//                   />
//                 </ErrorBoundary>

//                 <TransactionTimeline
//                   currentStep={signingStep}
//                   steps={[
//                     "PDF Uploaded",
//                     "Add Signature",
//                     "Processing",
//                     "Completed",
//                   ]}
//                 />
//               </div>
//             )}
//             <SignatureOverlay
//               onDrawingComplete={handleDrawingComplete}
//               color={signatureColor}
//               enabled={signingStep === 1}
//             />

//             {/* Existing components (unchanged) */}
//             <SigningStatus status={status} file={file} />

//             {signatureData && (
//               <div className="signed-document-link">
//                 <a
//                   href={`https://app.ethsign.xyz/sign/${signatureData.documentId}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   View Signed Document
//                 </a>
//               </div>
//             )}

//             <div className="sidebar">
//               <DocumentHistory
//                 documents={documents}
//                 onSelectDocument={handleSelectDocument}
//                 selectedDocId={selectedDoc?.id}
//               />
//             </div>

//             <div className="verification-section">
//               <ErrorBoundary>
//                 <VerifySignature2
//                   selectedDocument={selectedDoc}
//                   address={address}
//                 />
//               </ErrorBoundary>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };
// }

// good working minus action button

// import { useState, useRef, useEffect } from "react";
// import WalletButton from "./components/WalletButton";
// import FileDropzone from "./components/FileDropzone";
// import PdfPreview from "./components/PdfPreview";
// import SigningStatus from "./components/SigningStatus";
// import usePdfSigner from "./hooks/usePdfSigner2";
// import useDocumentHistory from "./hooks/useDocumentHistory";
// import DocumentHistory from "./components/DocumentHistory";
// import ErrorBoundary from "./components/ErrorBoundary";
// import VerifySignature2 from "./components/VerifySignature2";
// import SignatureToolbar from "./components/SignatureToolbar";
// import TransactionTimeline from "./components/TransactionTimeline";
// import SignatureOverlay from "./components/SignatureOverlay";
// const [showActionButton, setShowActionButton] = useState(false);
// import "../src/App.css";

// export default function App() {
//   // State declarations
//   const [isConnected, setIsConnected] = useState(false);
//   const [address, setAddress] = useState("");
//   const [file, setFile] = useState(null);
//   const [signingStep, setSigningStep] = useState(0);
//   const [signatureColor, setSignatureColor] = useState("#000000");
//   const [positions, setPositions] = useState([]);
//   const [pdfReady, setPdfReady] = useState(false);
//   const [showSignButton, setShowSignButton] = useState(false);
//   const [selectedDoc, setSelectedDoc] = useState(null);

//   const pdfContainerRef = useRef(null);
//   const { signPdf, status, signatureData, error, reset, captureSignature } =
//     usePdfSigner();
//   const { documents, addDocument } = useDocumentHistory();

//   // Handlers
//   const handleConnect = (addr) => {
//     try {
//       if (!addr) throw new Error("Invalid address received");
//       setIsConnected(true);
//       setAddress(addr);
//       reset();
//     } catch (err) {
//       console.error("Connection handler error:", err);
//       setIsConnected(false);
//       setAddress("");
//     }
//   };

//   const handleDisconnect = () => {
//     setIsConnected(false);
//     setAddress("");
//     setFile(null);
//     reset();
//     setSigningStep(0);
//   };

//   const handleFileAccepted = async (file) => {
//     setShowActionButton(false);
//     setFile(file);
//     if (!file) {
//       setFile(null);
//       reset();
//       return;
//     }

//     setPdfReady(false);
//     setShowSignButton(false);
//     setFile(file);

//     try {
//       const result = await signPdf(file, address);
//       addDocument({
//         id: result.documentId,
//         name: file.name,
//         txHash: result.transactionHash,
//         ...(result.signatureImage && {
//           signatureImage: result.signatureImage,
//           positions: result.positions,
//         }),
//       });

//       if (!result.signature) {
//         setSigningStep(1);
//       }
//     } catch (err) {
//       console.error("Signing failed:", err);
//       setSigningStep(0);
//     }
//   };

//   const handleDrawingComplete = (newPositions) => {
//     setPositions(newPositions);
//   };

//   const handleFinalizeSignature = async () => {
//     try {
//       setSigningStep(2);
//       setStatus("signing");

//       const canvas = document.getElementById("signature-canvas");
//       const signatureImage = canvas.toDataURL("image/png");
//       const signingTimestamp = new Date().toISOString();

//       captureSignature(positions, signatureImage);

//       const result = await signPdf(file, address, {
//         signatureImage,
//         signingTimestamp,
//         signatureType: "handwritten",
//         signatureVersion: "1.0",
//         positions,
//       });

//       addDocument({
//         id: result.documentId,
//         name: file.name,
//         txHash: result.transactionHash,
//         signatureImage,
//         timestamp: signingTimestamp,
//         positions,
//       });

//       setStatus("signed");
//     } catch (err) {
//       console.error("Signature finalization failed:", err);
//       setStatus("error");
//       setSigningStep(1);
//     }
//   };

//   const handleSelectDocument = async (docId) => {
//     try {
//       const doc = documents.find((d) => d.id === docId);
//       if (doc) {
//         setSelectedDoc(doc);
//       }
//     } catch (err) {
//       console.error("Failed to load document:", err);
//     }
//   };
//   // Temporary debug component - can remove after confirmation
//   const PdfLoadDebug = () => {
//     useEffect(() => {
//       console.log("PDF Load States:", {
//         fileExists: !!file,
//         showButton: showActionButton,
//         signingStep,
//       });
//     }, [file, showActionButton, signingStep]);

//     return null;
//   };

//   // Effects
//   useEffect(() => {
//     if (pdfReady && file && !showSignButton) {
//       setShowSignButton(true);
//     }
//   }, [pdfReady, file, showSignButton]);

//   useEffect(() => {
//     if (signatureData && signingStep === 2) {
//       setSigningStep(3);
//     }
//   }, [signatureData, signingStep]);

//   useEffect(() => {
//     if (file && !showActionButton) {
//       const timer = setTimeout(() => {
//         setShowActionButton(true);
//       }, 500); // Small delay to ensure everything is ready
//       return () => clearTimeout(timer);
//     }
//   }, [file, showActionButton]);

//   return (
//     <div className="app-container">
//       <h1>PDF Signing DApp</h1>

//       <WalletButton
//         isConnected={isConnected}
//         address={address}
//         onConnect={handleConnect}
//         onDisconnect={handleDisconnect}
//       />

//       {isConnected && (
//         <div className="main-content">
//           <FileDropzone
//             onFileAccepted={handleFileAccepted}
//             disabled={!isConnected}
//           />

//           {file && (
//             <div className="pdf-preview-container" ref={pdfContainerRef}>
//               <PdfPreview
//                 file={file}
//                 onLoadSuccess={() => {
//                   setShowActionButton(true);
//                   setStatus("ready-to-sign");
//                 }}
//                 onLoadError={() => {
//                   setStatus("load-error");
//                 }}
//               />
//               {showActionButton && (
//                 <div
//                   style={{
//                     textAlign: "center",
//                     marginTop: "20px",
//                     paddingTop: "20px",
//                     borderTop: "1px solid #e2e8f0",
//                   }}
//                 >
//                   <button
//                     onClick={() => setSigningStep(1)}
//                     style={{
//                       padding: "10px 24px",
//                       backgroundColor: "#3b82f6",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "6px",
//                       fontSize: "16px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Start Signing
//                   </button>
//                 </div>
//               )}
//               <PdfLoadDebug />
//               {/* {showSignButton && signingStep === 0 && (
//                 <div className="sign-action-button">
//                   <button
//                     onClick={() => setSigningStep(1)}
//                     className="primary-button"
//                   >
//                     Start Signing Process
//                   </button>
//                 </div>
//               )} */}

//               {signingStep >= 1 && (
//                 <SignatureOverlay
//                   color={signatureColor}
//                   onDrawingComplete={handleDrawingComplete}
//                 />
//               )}
//             </div>
//           )}

//           {file && signingStep >= 1 && (
//             <div className="signature-controls">
//               <ErrorBoundary>
//                 <SignatureToolbar
//                   onSign={handleFinalizeSignature}
//                   onClear={() => setSigningStep(1)}
//                   onColorChange={setSignatureColor}
//                   disabled={signingStep !== 1}
//                 />
//               </ErrorBoundary>

//               <TransactionTimeline
//                 currentStep={signingStep}
//                 steps={[
//                   "PDF Uploaded",
//                   "Add Signature",
//                   "Processing",
//                   "Completed",
//                 ]}
//               />
//             </div>
//           )}

//           <SigningStatus status={status} file={file} />

//           {signatureData && (
//             <div className="signed-document-link">
//               <a
//                 href={`https://app.ethsign.xyz/sign/${signatureData.documentId}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 View Signed Document
//               </a>
//             </div>
//           )}

//           <div className="sidebar">
//             <DocumentHistory
//               documents={documents}
//               onSelectDocument={handleSelectDocument}
//               selectedDocId={selectedDoc?.id}
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

// working too
// import { useState, useRef, useEffect } from "react";
// import WalletButton from "./components/WalletButton";
// import FileDropzone from "./components/FileDropzone";
// import PdfPreview from "./components/PdfPreview";
// import SigningStatus from "./components/SigningStatus";
// import usePdfSigner from "./hooks/usePdfSigner2";
// import useDocumentHistory from "./hooks/useDocumentHistory";
// import DocumentHistory from "./components/DocumentHistory";
// import ErrorBoundary from "./components/ErrorBoundary";
// import VerifySignature2 from "./components/VerifySignature2";
// import SignatureToolbar from "./components/SignatureToolbar";
// import TransactionTimeline from "./components/TransactionTimeline";
// import SignatureOverlay from "./components/SignatureOverlay";
// import "../src/App.css";

// export default function App() {
//   // State declarations
//   const [isConnected, setIsConnected] = useState(false);
//   const [address, setAddress] = useState("");
//   const [file, setFile] = useState(null);
//   const [signingStep, setSigningStep] = useState(0);
//   const [signatureColor, setSignatureColor] = useState("#000000");
//   const [positions, setPositions] = useState([]);
//   const [showActionButton, setShowActionButton] = useState(false);
//   const [selectedDoc, setSelectedDoc] = useState(null);

//   const pdfContainerRef = useRef(null);
//   const { signPdf, status, signatureData, error, reset, captureSignature } =
//     usePdfSigner();
//   const { documents, addDocument } = useDocumentHistory();

//   // Handlers
//   const handleConnect = (addr) => {
//     try {
//       if (!addr) throw new Error("Invalid address received");
//       setIsConnected(true);
//       setAddress(addr);
//       reset();
//     } catch (err) {
//       console.error("Connection handler error:", err);
//       setIsConnected(false);
//       setAddress("");
//     }
//   };

//   const handleDisconnect = () => {
//     setIsConnected(false);
//     setAddress("");
//     setFile(null);
//     reset();
//     setSigningStep(0);
//     setShowActionButton(false);
//   };

//   const handleFileAccepted = (file) => {
//     setFile(file);
//     setShowActionButton(false);
//     setSigningStep(0);
//     reset();
//   };

//   const handleStartSigning = () => {
//     setSigningStep(1);
//     // setShowActionButton(false);
//   };

//   const handleDrawingComplete = (newPositions) => {
//     setPositions(newPositions);
//   };

//   const handleFinalizeSignature = async () => {
//     try {
//       setSigningStep(2);
//       setStatus("signing");

//       const canvas = document.getElementById("signature-canvas");
//       const signatureImage = canvas.toDataURL("image/png");
//       const signingTimestamp = new Date().toISOString();

//       captureSignature(positions, signatureImage);

//       const result = await signPdf(file, address, {
//         signatureImage,
//         signingTimestamp,
//         signatureType: "handwritten",
//         signatureVersion: "1.0",
//         positions,
//       });

//       addDocument({
//         id: result.documentId,
//         name: file.name,
//         txHash: result.transactionHash,
//         signatureImage,
//         timestamp: signingTimestamp,
//         positions,
//       });

//       setStatus("signed");
//       setSigningStep(3);
//     } catch (err) {
//       console.error("Signature finalization failed:", err);
//       setStatus("error");
//       setSigningStep(1);
//     }
//   };

//   const handleSelectDocument = async (docId) => {
//     try {
//       const doc = documents.find((d) => d.id === docId);
//       if (doc) {
//         setSelectedDoc(doc);
//       }
//     } catch (err) {
//       console.error("Failed to load document:", err);
//     }
//   };

//   // Effects
//   useEffect(() => {
//     return () => {
//       // Cleanup when component unmounts
//       if (file) {
//         URL.revokeObjectURL(file);
//       }
//     };
//   }, [file]);

//   return (
//     <div className="app-container">
//       <h1>PDF Signing DApp</h1>

//       <WalletButton
//         isConnected={isConnected}
//         address={address}
//         onConnect={handleConnect}
//         onDisconnect={handleDisconnect}
//       />

//       {isConnected && (
//         <div className="main-content">
//           <FileDropzone
//             onFileAccepted={handleFileAccepted}
//             disabled={!isConnected}
//           />

//           {file && (
//             <div className="pdf-preview-container" ref={pdfContainerRef}>
//               <PdfPreview
//                 file={file}
//                 onLoadSuccess={() => {
//                   setShowActionButton(true);
//                   setStatus("ready-to-sign");
//                 }}
//                 onLoadError={() => {
//                   setStatus("load-error");
//                   setShowActionButton(false);
//                 }}
//               />
//               <SigningStatus
//                 status={status}
//                 txHash={signatureData?.transactionHash}
//                 onSignClick={handleStartSigning} // Your existing signing handler
//                 isReadyToSign={status === "ready-to-sign" && signingStep === 0}
//               />

//               {signingStep >= 1 && (
//                 <SignatureOverlay
//                   color={signatureColor}
//                   onDrawingComplete={handleDrawingComplete}
//                 />
//               )}
//             </div>
//           )}

//           {file && signingStep >= 1 && (
//             <div className="signature-controls">
//               <ErrorBoundary>
//                 <SignatureToolbar
//                   onSign={handleFinalizeSignature}
//                   onClear={() => setSigningStep(1)}
//                   onColorChange={setSignatureColor}
//                   disabled={signingStep !== 1}
//                 />
//               </ErrorBoundary>

//               <TransactionTimeline
//                 currentStep={signingStep}
//                 steps={[
//                   "PDF Uploaded",
//                   "Add Signature",
//                   "Processing",
//                   "Completed",
//                 ]}
//               />
//             </div>
//           )}

//           {/* <SigningStatus status={status} file={file} /> */}

//           {signatureData && (
//             <div className="signed-document-link">
//               <a
//                 href={`https://app.ethsign.xyz/sign/${signatureData.documentId}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 View Signed Document
//               </a>
//             </div>
//           )}

//           <div className="sidebar">
//             <DocumentHistory
//               documents={documents}
//               onSelectDocument={handleSelectDocument}
//               selectedDocId={selectedDoc?.id}
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

// working
// import { useState, useRef, useEffect } from "react";
// import WalletButton from "./components/WalletButton";
// import FileDropzone from "./components/FileDropzone";
// import PdfPreview from "./components/PdfPreview";
// import SigningStatus from "./components/SigningStatus";
// import usePdfSigner2 from "./hooks/usePdfSigner2";
// import useDocumentHistory from "./hooks/useDocumentHistory";
// import DocumentHistory from "./components/DocumentHistory";
// import ErrorBoundary from "./components/ErrorBoundary";
// import VerifySignature2 from "./components/VerifySignature2";
// import TransactionTimeline from "./components/TransactionTimeline";
// import useApproveSign from "./hooks/useApproveSign";
// import "../src/App.css";

// export default function App() {
//   // State declarations
//   const [isConnected, setIsConnected] = useState(false);
//   const [address, setAddress] = useState("");
//   const [file, setFile] = useState(null);
//   const [selectedDoc, setSelectedDoc] = useState(null);
//   const [isReadyToSign, setIsReadyToSign] = useState(false);

//   const pdfContainerRef = useRef(null);
//   const { signPdf, status, signatureData, error, reset } = usePdfSigner2();
//   const { documents, addDocument } = useDocumentHistory();
//   const { approveAndSign, isSigning } = useApproveSign();

//   const [debug, setDebug] = useState({});

//   useEffect(() => {
//     setDebug({
//       fileExists: !!file,
//       addressExists: !!address,
//       pdfLoadStatus,
//       isConnected,
//       status,
//     });
//   }, [file, address, pdfLoadStatus, isConnected, status]);

//   // Add this temporarily in your JSX
//   <div
//     style={{
//       position: "fixed",
//       bottom: 0,
//       background: "white",
//       padding: "10px",
//       zIndex: 1000,
//     }}
//   >
//     <pre>{JSON.stringify(debug, null, 2)}</pre>
//   </div>;

//   // Handlers
//   const handleConnect = (addr) => {
//     setIsConnected(true);
//     setAddress(addr);
//     reset();
//   };

//   const handleDisconnect = () => {
//     setIsConnected(false);
//     setAddress("");
//     setFile(null);
//     reset();
//     setIsReadyToSign(false);
//   };

//   const handleFileAccepted = (file) => {
//     console.log("File accepted:", file.name);
//     setFile(file);
//     setIsReadyToSign(true);
//     reset();
//   };
//   const handleStartSigning = async () => {
//     try {
//       await approveAndSign({
//         file,
//         address,
//         signPdf,
//         addDocument,
//       });
//     } catch (err) {
//       console.error("Signing failed:", err);
//     }
//   };

//   // const handleStartSigning = async () => {
//   //   // try {
//   //   //   await approveAndSign({
//   //   //     file,
//   //   //     address,
//   //   //     signPdf,
//   //   //     addDocument,
//   //   //   });
//   //   // } catch (err) {
//   //   //   console.error("Signing failed:", err);
//   //   // }
//   //   try {
//   //     const signingTimestamp = new Date().toISOString();
//   //     const result = await signPdf(file, address, {
//   //       signingTimestamp,
//   //       signatureType: address,
//   //       signatureVersion: "1.0",
//   //     });

//   //     addDocument({
//   //       id: result.documentId,
//   //       name: file.name,
//   //       txHash: result.transactionHash,
//   //       timestamp: signingTimestamp,
//   //     });
//   //   } catch (err) {
//   //     console.error("Signing error:", err);
//   //   }
//   // };

//   const handleSelectDocument = (docId) => {
//     const doc = documents.find((d) => d.id === docId);
//     if (doc) setSelectedDoc(doc);
//   };

//   // Clean up file URLs
//   // Ensure all required states are properly initialized
//   useEffect(() => {
//     return () => {
//       if (file) URL.revokeObjectURL(file);
//     };
//   }, [file]);

//   return (
//     <div className="app-container">
//       <h1>PDF Signing DApp</h1>

//       <WalletButton
//         isConnected={isConnected}
//         address={address}
//         onConnect={handleConnect}
//         onDisconnect={handleDisconnect}
//       />

//       {isConnected && (
//         <div className="main-content">
//           <FileDropzone
//             onFileAccepted={handleFileAccepted}
//             disabled={!isConnected}
//           />

//           {file && (
//             <div className="pdf-preview-container" ref={pdfContainerRef}>
//               <PdfPreview
//                 file={file}
//                 onLoadSuccess={() => {
//                   console.log("PDF loaded successfully");
//                   setIsReadyToSign(true);
//                   setStatus("ready-to-sign");
//                 }}
//                 onLoadError={() => {
//                   console.error("PDF load failed:", error);
//                   setIsReadyToSign(false);
//                   setStatus("load-error");
//                 }}
//               />

//               <SigningStatus
//                 status={status} //status from usePdfSigner
//                 txHash={signatureData?.transactionHash}
//                 onSignClick={handleStartSigning}
//                 isReadyToSign={isReadyToSign && !!address}
//                 isSigning={isSigning}
//               />
//             </div>
//           )}

//           {isSigning && (
//             <TransactionTimeline
//               currentStep={isSigning ? 1 : 0}
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
//               onSelectDocument={handleSelectDocument}
//               selectedDocId={selectedDoc?.id}
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
import { useState, useRef, useEffect } from "react";
import WalletButton from "./components/WalletButton";
import FileDropzone from "./components/FileDropzone";
import PdfPreview from "./components/PdfPreview";
import SigningStatus from "./components/SigningStatus";
import usePdfSigner from "./hooks/usePdfSigner2";
import useDocumentHistory from "./hooks/useDocumentHistory";
import DocumentHistory from "./components/DocumentHistory";
import TransactionTimeline from "./components/TransactionTimeline";
import "../src/App.css";

export default function App() {
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const pdfContainerRef = useRef(null);
  const { signPdf, status, signatureData, reset } = usePdfSigner();
  const { documents, addDocument } = useDocumentHistory();

  useEffect(() => {
    console.log("Current signing state:", {
      status,
      isSigning,
      file: file?.name,
      address,
      error,
    });
  }, [status, isSigning, file, address, error]);

  // Get current wallet address
  // const getCurrentWalletAddress = async () => {
  //   if (window.ethereum) {
  //     const accounts = await window.ethereum.request({
  //       method: "eth_accounts",
  //     });
  //     return accounts[0] || null;
  //   }
  //   return null;
  // };
  // In App.jsx
  const getCurrentWalletAddress = async () => {
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
  };

  // Handle PDF load state
  const handlePdfLoadSuccess = () => {
    setIsPdfReady(true);
  };

  const handlePdfLoadError = () => {
    setIsPdfReady(false);
  };

  // Signing function
  const handleSignDocument = async () => {
    if (!file || !address) return;

    try {
      setIsSigning(true);

      // Verify connected wallet
      const currentAddress = await getCurrentWalletAddress();
      if (
        !currentAddress ||
        currentAddress.toLowerCase() !== address.toLowerCase()
      ) {
        throw new Error("Connected wallet mismatch");
      }

      // Prepare signature data
      const signingTimestamp = new Date().toISOString();

      // Sign the document
      const result = await signPdf(file, address, {
        signingTimestamp,
        signatureType: "contract", // or "wallet" depending on your needs
        signatureVersion: "1.0",
      });

      // Store the result
      addDocument({
        id: result.documentId,
        name: file.name,
        txHash: result.transactionHash,
        timestamp: signingTimestamp,
        signer: address,
      });
    } catch (error) {
      console.error("Signing failed:", error);
    } finally {
      setIsSigning(false);
    }
  };

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
            onFileAccepted={(file) => {
              setFile(file);
              setIsPdfReady(false);
              reset();
            }}
            disabled={!isConnected}
          />

          {file && (
            <div className="pdf-preview-container" ref={pdfContainerRef}>
              <PdfPreview
                file={file}
                onLoadSuccess={handlePdfLoadSuccess}
                onLoadError={handlePdfLoadError}
              />

              <SigningStatus
                address={address}
                txHash={signatureData?.transactionHash}
                isReadyToSign={isPdfReady}
                onSignClick={handleSignDocument}
              />
            </div>
          )}

          {isSigning && (
            <TransactionTimeline
              currentStep={1}
              steps={["PDF Uploaded", "Signing", "Completed"]}
            />
          )}

          {/* ... rest of your components ... */}
        </div>
      )}
    </div>
  );
}
