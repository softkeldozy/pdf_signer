import { useState } from "react";

export default function usePdfSigner() {
  const [status, setStatus] = useState("idle");
  const [signatureData, setSignatureData] = useState(null);
  const [error, setError] = useState(null);

  const signPdf = async (file, walletAddress) => {
    try {
      // 1. Validate inputs
      if (!file || !walletAddress) {
        throw new Error("Missing required parameters");
      }

      setStatus("preparing");
      setError(null);

      // 2. Dynamically load heavy dependencies
      const [{ Ethereum }, { createWalletClient, custom }, { mainnet }] =
        await Promise.all([
          import("@ethsign/sp-sdk"),
          import("viem"),
          import("viem/chains"),
        ]);

      // 3. Prepare file
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // 4. Initialize clients
      const walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum),
      });

      const ethSign = new Ethereum();

      // 5. Sign document
      setStatus("signing");
      const response = await ethSign.signDocument({
        walletClient,
        data: uint8Array,
        name: file.name,
        signaturePayload: {
          name: "PDF Signer DApp",
          version: "1.0",
        },
      });

      // 6. Store results
      setSignatureData({
        signature: response.signature,
        documentId: response.documentId,
        transactionHash: response.transactionHash,
      });
      setStatus("success");

      return response;
    } catch (err) {
      console.error("Signing error:", err);
      setError({
        message: err.message || "Signing failed",
        code: err.code,
      });
      setStatus("error");
      throw err;
    }
  };

  const reset = () => {
    setStatus("idle");
    setSignatureData(null);
    setError(null);
  };

  // Add to usePdfSigner.js
  const requestSignature = async (documentId, signerAddress) => {
    const ethSign = new Ethereum();
    return ethSign.signExistingDocument({
      walletClient,
      documentId,
      signerAddress,
    });
  };

  return { signPdf, status, signatureData, error, reset };
}
