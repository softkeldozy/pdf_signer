// import { useState } from "react";
// import Header from "./components/Header";
// import WalletButton from "./components/WalletButton";
// import FileDropzone from "./components/FileDropzone";
// import SigningSteps from "./components/SigningSteps";
// import StatusIndicator from "./components/StatusIndicator";
// import PdfPreview from "./components/PdfPreview";
// import useDocumentHistory from "./hooks/useDocumentHistory";

// import "../src/App.css";

// function App() {
//   const [isConnected, setIsConnected] = useState(false);
//   const [address, setAddress] = useState("");
//   const [file, setFile] = useState(null);
//   const { documents, addDocument, clearHistory } = useDocumentHistory();
//   const [connectionError, setConnectionError] = useState(null);
//   const usePdfSigner = () => {
//     const [signer, setSigner] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//       import("./hooks/usePdfSigner")
//         .then((module) => setSigner(() => module.usePdfSigner))
//         .catch((err) => {
//           console.error("Failed to load signer:", err);
//           setError("Failed to load signing functionality");
//         });
//     }, []);

//     return error ? { error } : signer ? signer() : null;
//   };

//   const handleConnect = (address) => {
//     setConnectionError(null);
//     setIsConnected(true);
//     setAddress(address);
//     reset();
//   };

//   const handleDisconnect = () => {
//     setIsConnected(false);
//     setAddress("");
//     setFile(null);
//     // reset();
//   };

//   const handleFileAccepted = async (file) => {
//     if (!file) {
//       setFile(null);
//       // reset();
//       return;
//     }
//     setFile(file);
//     try {
//       const result = await signPdf(file, address);
//       addDocument({
//         id: result.documentId,
//         name: file.name,
//         date: new Date().toISOString(),
//         txHash: result.transactionHash,
//       });
//     } catch (err) {
//       console.error("Signing failed:", err);
//     }
//   };

//   const currentStep = isConnected
//     ? file
//       ? signingStatus === "success"
//         ? 4
//         : signingStatus === "signing"
//         ? 3
//         : 2
//       : 1
//     : 0;

//   return (
//     <div className="container">
//       <Header />
//       <WalletButton
//         isConnected={isConnected}
//         address={address}
//         onConnect={handleConnect}
//         onDisconnect={handleDisconnect}
//         // onError={setConnectionError} // Pass error handler
//       />

//       {connectionError && (
//         <div className="error-message">Connection Error: {connectionError}</div>
//       )}
//       {isConnected && (
//         <>
//           <FileDropzone
//             onFileAccepted={setFile}
//             disabled={!isConnected}
//             // disabled={signingStatus === "signing"}
//             file={file}
//           />
//           {file && <PdfPreview file={file} />}
//           <StatusIndicator
//             status={signingStatus}
//             file={file}
//             signatureData={signatureData}
//             error={error}
//           />
//           <SigningSteps currentStep={currentStep} />
//         </>
//       )}
//     </div>
//   );
// }

// export default App;

// // export default function App() {
// //   console.log("App component rendering"); // Check browser console
// //   return (
// //     <div style={{ padding: "20px" }}>
// //       <h1 style={{ color: "red" }}>TEST UI</h1>
// //       <p>If you see this, React is working</p>
// //     </div>
// //   );
// // }

// import { useState } from "react";
// import WalletConnector from "./components/walletConnector";

// export default function App() {
//   const [address, setAddress] = useState(null);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>PDF Signer</h1>

//       {address ? (
//         <div>
//           <p>Connected: {address}</p>
//           {/* Rest of your UI will go here */}
//         </div>
//       ) : (
//         <WalletConnector onConnect={(addr) => setAddress(addr)} />
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import WalletButton from "./components/WalletButton";
import FileDropzone from "./components/FileDropzone";
import PdfPreview from "./components/PdfPreview";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");

  // Safe connection handler
  const handleConnect = (addr) => {
    try {
      if (!addr) throw new Error("Invalid address received");
      setIsConnected(true);
      setAddress(addr);
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
          {/* Your other components will go here */}
          <p>Ready to sign documents!</p>
        </div>
      )}
    </div>
  );
}
