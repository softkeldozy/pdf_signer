import { useState } from "react";
import { Ethereum } from "@ethsign/sp-sdk";

const VerifySignature = () => {
  const [documentId, setDocumentId] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("idle");
  const [verificationResult, setVerificationResult] = useState(null);

  const verifySignature = async () => {
    try {
      setVerificationStatus("verifying");

      const ethSign = new Ethereum();
      const result = await ethSign.getDocument(documentId);

      setVerificationResult(result);
      setVerificationStatus("verified");
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("error");
    }
  };

  return (
    <div className="card">
      <h2>Verify Signature</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          placeholder="Enter Document ID"
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "var(--border-radius)",
            border: "1px solid var(--gray)",
          }}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={verifySignature}
        disabled={verificationStatus === "verifying" || !documentId}
      >
        {verificationStatus === "verifying" ? "Verifying..." : "Verify"}
      </button>

      {verificationStatus === "verified" && verificationResult && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Verification Result</h3>
          <div
            style={{
              backgroundColor: "#f0fdf4",
              padding: "1rem",
              borderRadius: "var(--border-radius)",
              marginTop: "0.5rem",
            }}
          >
            <p>
              <strong>Document ID:</strong> {verificationResult.documentId}
            </p>
            <p>
              <strong>Signer:</strong> {verificationResult.signer}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(verificationResult.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: "var(--success)" }}>Valid</span>
            </p>
          </div>
        </div>
      )}

      {verificationStatus === "error" && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            padding: "1rem",
            borderRadius: "var(--border-radius)",
            marginTop: "1rem",
            color: "var(--danger)",
          }}
        >
          <p>Invalid or not found document ID</p>
        </div>
      )}
    </div>
  );
};

export default VerifySignature;
