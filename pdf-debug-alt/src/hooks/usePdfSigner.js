// import { useState } from "react";
// import { Ethereum } from "@ethsign/sp-sdk";
// import { createWalletClient, custom } from "viem";
// import { mainnet } from "viem/chains";

// export const usePdfSigner = () => {
//   const [signingStatus, setSigningStatus] = useState("idle");
//   const [signatureData, setSignatureData] = useState(null);
//   const [error, setError] = useState(null);

//   const signPdf = async (file, walletAddress) => {
//     try {
//       setSigningStatus("preparing");
//       setError(null);

//       // 1. Prepare the file
//       const arrayBuffer = await file.arrayBuffer();
//       const uint8Array = new Uint8Array(arrayBuffer);

//       // 2. Initialize wallet client
//       const walletClient = createWalletClient({
//         chain: mainnet,
//         transport: custom(window.ethereum),
//       });

//       // 3. Initialize EthSign client
//       const ethSign = new Ethereum();

//       setSigningStatus("signing");

//       // 4. Sign the document
//       const response = await ethSign.signDocument({
//         walletClient,
//         data: uint8Array,
//         name: file.name,
//         signaturePayload: {
//           name: "PDF Signer DApp",
//           version: "1.0",
//         },
//       });

//       setSignatureData({
//         signature: response.signature,
//         documentId: response.documentId,
//         transactionHash: response.transactionHash,
//       });
//       setSigningStatus("success");

//       return response;
//     } catch (err) {
//       const errorMessage = handleSigningError(err);
//       const formattedError = new Error(errorMessage);
//       setError(formattedError);
//       setSigningStatus("error");
//       throw formattedError;
//     }
//   };

//   return {
//     signPdf,
//     signingStatus,
//     signatureData,
//     error,
//     reset: () => {
//       setSigningStatus("idle");
//       setSignatureData(null);
//       setError(null);
//     },
//   };
// };

import { useState } from "react";
import { Ethereum } from "@ethsign/sp-sdk";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

// Add this error handler function
const handleSigningError = (error) => {
  if (error.code === 4001) return "User rejected the request";
  if (error.message?.includes("User denied")) return "Signature rejected";
  if (error.message?.includes("insufficient funds"))
    return "Insufficient ETH for gas";
  return "Signing failed. Please try again";
};

export const usePdfSigner = () => {
  const [signingStatus, setSigningStatus] = useState("idle");
  const [signatureData, setSignatureData] = useState(null);
  const [error, setError] = useState(null);

  const signPdf = async (file, walletAddress) => {
    try {
      setSigningStatus("preparing");
      setError(null);

      // 1. Verify window.ethereum exists
      if (!window.ethereum) {
        throw new Error("Ethereum provider not found");
      }

      // 2. Prepare the file
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // 3. Initialize clients
      const walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum),
      });

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
      const errorMessage = handleSigningError(err);
      const formattedError = new Error(errorMessage);
      console.error("Signing error:", err); // Log original error
      setError(formattedError);
      setSigningStatus("error");
      throw formattedError;
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
