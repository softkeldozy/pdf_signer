import { useState } from "react";
import Header from "./components/Header";
import WalletButton from "./components/WalletButton";
import FileDropzone from "./components/FileDropzone";
import SigningSteps from "./components/SigningSteps";
import StatusIndicator from "./components/StatusIndicator";
import PdfPreview from "./components/PdfPreview";
import { usePdfSigner } from "./hooks/usePdfSigner";
import "./styles/index.css";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("idle");
  const [file, setFile] = useState(null);
  const { signPdf, signingStatus, signatureData, error, reset } =
    usePdfSigner();

  const handleConnect = (address) => {
    // setStatus("idle");
    setIsConnected(true);
    setAddress(address);
    reset();
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress("");
    setFile(null);
    reset();
    // setStatus("idle");
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
      console.log("Signing failed:", err);
    }
  };

  const currentStep = isConnected
    ? file
      ? status === "success"
        ? 4
        : status === "signing"
        ? 3 //Signing
        : 2 //File Uploaded
      : 1 //Wallet Connected
    : 0; //Not Started

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
            disabled={
              signingStatus === "signing" || signingStatus === "Preparing"
            }
            file={file}
          />
          {/* Handling file preview  */}
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
