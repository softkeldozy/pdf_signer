import { useState } from "react";
import { Ethereum } from "@ethsign/sp-sdk";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

export const usePdfSigner = () => {
  const [signingStatus, setSigningStatus] = useState("idle");
  const [signatureData, setSignatureData] = useState(null);
  const [error, setError] = useState(null);

  const signPdf = async (file, walletAddress) => {
    try {
      setSigningStatus("preparing");
      setError(null);

      // 1. Prepare the file
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // 2. Initialize wallet client
      const walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum),
      });

      // 3. Initialize EthSign client
      const ethSign = new Ethereum();

      setSigningStatus("signing");

      // 4. Sign the document
      const response = await ethSign.signDocument({
        walletClient,
        data: uint8Array,
        name: file.name,
        signaturePayload: {
          name: "PDF Signer DApp",
          version: "1.0",
        },
      });

      setSignatureData({
        signature: response.signature,
        documentId: response.documentId,
        transactionHash: response.transactionHash,
      });
      setSigningStatus("success");

      return response;
    } catch (err) {
      console.error("Signing error:", err);
      setError(err);
      setSigningStatus("error");
      throw err;
    }
  };

  return {
    signPdf,
    signingStatus,
    signatureData,
    error,
    reset: () => {
      setSigningStatus("idle");
      setSignatureData(null);
      setError(null);
    },
  };
};
