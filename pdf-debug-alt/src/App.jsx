import { useState } from "react";
import Header from "./components/Header";
import WalletButton from "./components/WalletButton";
import FileDropzone from "./components/FileDropzone";
import SigningSteps from "./components/SigningSteps";
import StatusIndicator from "./components/StatusIndicator";
import PdfPreview from "./components/PdfPreview";
import "./styles/index.css";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("idle");
  const [file, setFile] = useState(null);

  const handleConnect = () => {
    setStatus("idle");
    setIsConnected(true);
    setAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e"); // Mock address for UI
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress("");
    setFile(null);
    setStatus("idle");
  };

  const handleFileAccepted = (file) => {
    setFile(file);
    setStatus("uploading");
    // Simulate signing process for UI demo
    setTimeout(() => setStatus("signing"), 1000);
    setTimeout(() => setStatus("success"), 3000);
  };

  const currentStep = isConnected
    ? file
      ? status === "success"
        ? 4
        : status === "signing"
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
            disabled={status === "signing" || status === "uploading"}
            file={file}
          />
          {/* Handling file preview  */}
          {file && <PdfPreview file={file} />}
          <StatusIndicator status={status} file={file} />
          <SigningSteps currentStep={currentStep} />
        </>
      )}
    </div>
  );
}

export default App;
