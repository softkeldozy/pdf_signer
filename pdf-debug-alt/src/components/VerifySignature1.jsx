// import { useState } from "react";
// import { Ethereum } from "@ethsign/sp-sdk";

// export default function VerifySignature() {
//   const [docId, setDocId] = useState("");
//   const [result, setResult] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const verify = async () => {
//     try {
//       setIsLoading(true);
//       const ethSign = new Ethereum();
//       const doc = await ethSign.getDocument(docId);
//       setResult(doc);
//     } catch (err) {
//       setResult({ error: err.message });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="verification-card">
//       <h3>Verify Document</h3>
//       <input
//         value={docId}
//         onChange={(e) => setDocId(e.target.value)}
//         placeholder="Enter Document ID"
//       />
//       <button onClick={verify} disabled={isLoading}>
//         {isLoading ? "Verifying..." : "Verify"}
//       </button>

//       {result && (
//         <div className="result">
//           {result.error ? (
//             <p className="error">{result.error}</p>
//           ) : (
//             <>
//               <p>Signer: {result.signer}</p>
//               <p>Date: {new Date(result.createdAt).toLocaleString()}</p>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";

export default function VerifySignature() {
  const [docId, setDocId] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const verify = async () => {
    try {
      // 1. Validate input
      if (!docId.trim()) {
        throw new Error("Please enter a document ID");
      }

      setIsLoading(true);
      setError(null);
      setResult(null);

      // 2. Dynamically import to prevent initialization errors
      const { Ethereum } = await import("@ethsign/sp-sdk");
      const ethSign = new Ethereum();

      // 3. Verify document
      const doc = await ethSign.getDocument(docId);

      if (!doc?.signer) {
        throw new Error("Invalid document format");
      }

      setResult(doc);
    } catch (err) {
      console.error("Verification failed:", err);
      setError(err.message || "Verification failed");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>Verify Document</h3>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
          placeholder="Enter Document ID"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>

      <button
        onClick={verify}
        disabled={isLoading || !docId.trim()}
        style={{
          padding: "10px 15px",
          background: isLoading ? "#cccccc" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {isLoading ? "Verifying..." : "Verify Signature"}
      </button>

      {/* Error Display */}
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

      {/* Result Display */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h4>Verification Result</h4>
          <div
            style={{
              padding: "15px",
              background: "#e8f5e9",
              borderRadius: "4px",
              marginTop: "10px",
            }}
          >
            <p>
              <strong>Signer:</strong> {result.signer}
            </p>
            <p>
              <strong>Signed At:</strong>{" "}
              {new Date(result.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Document ID:</strong> {result.documentId}
            </p>

            <a
              href={`https://app.ethsign.xyz/sign/${result.documentId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "10px",
                color: "#1e88e5",
                textDecoration: "none",
              }}
            >
              View Document on EthSign
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
