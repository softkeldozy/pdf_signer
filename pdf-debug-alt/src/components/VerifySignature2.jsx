import { useState, useEffect } from "react";
import { handleSigningError } from "../utils/errorHandler"; // Make sure this exists

export default function VerifySignature() {
  const [docId, setDocId] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Check if Ethereum provider is available
  useEffect(() => {
    setIsReady(!!window.ethereum?.isMetaMask);
  }, []);

  const verify = async () => {
    try {
      // Validate input first
      if (!docId.trim()) {
        throw new Error("Please enter a document ID");
      }

      setIsLoading(true);
      setError(null);
      setResult(null);

      // Dynamic import to prevent initialization errors
      const { Ethereum } = await import("@ethsign/sp-sdk");
      const ethSign = new Ethereum();

      // Verify document
      const doc = await ethSign.getDocument(docId);

      if (!doc?.signer) {
        throw new Error("Invalid document response");
      }

      setResult(doc);
    } catch (err) {
      const formattedError = new Error(handleSigningError(err));
      console.error("Verification error:", formattedError);
      setError(formattedError.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div style={{ padding: "20px", background: "#fff3e0" }}>
        <p>Wallet not connected. Please connect your wallet first.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        margin: "20px 0",
        background: "white",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>Verify Document</h3>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
          placeholder="Enter EthSign Document ID"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </div>

      <button
        onClick={verify}
        disabled={isLoading || !docId.trim()}
        style={{
          padding: "10px 15px",
          background: isLoading ? "#bdbdbd" : "#3f51b5",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {isLoading ? "Verifying..." : "Verify Document"}
      </button>

      {/* Error display */}
      {error && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            background: "#ffebee",
            color: "#d32f2f",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {/* Result display */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              padding: "15px",
              background: "#e8f5e9",
              borderRadius: "4px",
            }}
          >
            <p>
              <strong>Document ID:</strong> {result.documentId}
            </p>
            <p>
              <strong>Signed by:</strong> {result.signer}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(result.createdAt).toLocaleString()}
            </p>

            <a
              href={`https://app.ethsign.xyz/sign/${result.documentId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "10px",
                color: "#1565c0",
              }}
            >
              View on EthSign →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
