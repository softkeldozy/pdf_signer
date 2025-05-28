import { useState } from "react";
import Header from "./components/Header";
import WalletButton from "./components/WalletButton";
import FileDropzone from "./components/FileDropzone";
import SigningSteps from "./components/SigningSteps";
import StatusIndicator from "./components/StatusIndicator";
// import PdfPreview from "./components/PdfPreview";
// import { usePdfSigner } from "./hooks/usePdfSigner";
import useDocumentHistory from "./hooks/useDocumentHistory";
import "../src/App.css";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  // const { signPdf, signingStatus, signatureData, error, reset } =
  //   usePdfSigner();
  const { documents, addDocument, clearHistory } = useDocumentHistory();

  const handleConnect = (address) => {
    setIsConnected(true);
    setAddress(address);
    reset();
  };

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
        date: new Date().toISOString(),
        txHash: result.transactionHash,
      });
    } catch (err) {
      console.error("Signing failed:", err);
    }
  };

  const currentStep = isConnected
    ? file
      ? signingStatus === "success"
        ? 4
        : signingStatus === "signing"
        ? 3
        : 2
      : 1
    : 0;

  return (
    <div className="container">
      <Header />
      <WalletButton
        isConnected={isConnected}
        address={address}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      {isConnected && (
        <>
          <FileDropzone
            onFileAccepted={handleFileAccepted}
            disabled={signingStatus === "signing"}
            file={file}
          />
          {file && <PdfPreview file={file} />}
          <StatusIndicator
            status={signingStatus}
            file={file}
            signatureData={signatureData}
            error={error}
          />
          <SigningSteps currentStep={currentStep} />
        </>
      )}
    </div>
  );
}

export default App;

// export default function App() {
//   console.log("App component rendering"); // Check browser console
//   return (
//     <div style={{ padding: "20px" }}>
//       <h1 style={{ color: "red" }}>TEST UI</h1>
//       <p>If you see this, React is working</p>
//     </div>
//   );
// }
