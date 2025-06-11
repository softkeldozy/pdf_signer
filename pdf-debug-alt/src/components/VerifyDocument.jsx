// src/components/VerifyDocument.jsx
import { useState } from "react";
import { keccak256 } from "viem";
import useDocumentStore from "../hooks/store/documentStore";
import "../styles/verifydoc.css";

export default function VerifyDocument() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const { documents } = useDocumentStore();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const verifyFile = async () => {
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const fileHash = keccak256(uint8Array); // 0x...

    const match = documents.find((doc) => doc.hash === fileHash);

    if (match) {
      setResult({
        verified: true,
        message: `✅ File is valid and signed by ${match.signer}`,
        metadata: match,
      });
    } else {
      setResult({
        verified: false,
        message: "❌ File not recognized or altered.",
      });
    }
  };

  return (
    <div className="verify-section">
      <h3>Verify a Signed PDF</h3>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button
        className="PdfVerifyBtn"
        variant="contained"
        onClick={verifyFile}
        disabled={!file}
      >
        Verify
      </button>

      {result && (
        <div className="verify-result">
          <p>{result.message}</p>
          {result.metadata && (
            <div>
              <p>
                <strong>Signer:</strong> {result.metadata.signer}
              </p>
              <p>
                <strong>Signed At:</strong>{" "}
                {new Date(result.metadata.signedAt).toLocaleString()}
              </p>
              <p>
                <strong>File:</strong>{" "}
                <a href={result.metadata.fileUrl} target="_blank">
                  View
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
