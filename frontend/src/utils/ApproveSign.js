import { useState } from "react";

export default function useApproveSign() {
  const [isSigning, setIsSigning] = useState(false);
  const [status, setStatus] = useState("idle");

  const approveAndSign = async ({
    file,
    address,
    signatureImage,
    signPdf,
    addDocument,
  }) => {
    try {
      if (!address) {
        throw new Error("No wallet connected");
      }

      setIsSigning(true);
      setStatus("signing");

      // Helper function to get current wallet address
      const getCurrentWalletAddress = async () => {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          return accounts[0] || "";
        }
        return "";
      };

      const signingTimestamp = new Date().toISOString();
      const signerAddress = await getCurrentWalletAddress();

      if (signerAddress.toLowerCase() !== address.toLowerCase()) {
        throw new Error("Only the connected wallet can sign this document");
      }

      const signaturePayload = {
        ...(signatureImage && { signatureImage }),
        signingTimestamp,
        signatureType: signerAddress, // Using signer's address as signature type
        signatureVersion: "1.0",
        signer: address,
      };

      const result = await signPdf(file, address, signaturePayload);

      addDocument({
        id: result.documentId,
        name: file.name,
        txHash: result.transactionHash,
        ...(signatureImage && { signatureImage }),
        timestamp: signingTimestamp,
        signer: address,
      });

      setStatus("signed");
      return result;
    } catch (err) {
      console.error("Signing failed:", err);
      setStatus("error");
      throw err; // Re-throw to allow handling in calling component
    } finally {
      setIsSigning(false);
    }
  };

  return {
    approveAndSign,
    isSigning,
    status,
  };
}
