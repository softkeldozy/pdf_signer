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

// import { useState } from "react";
// import { Ethereum } from "@ethsign/sp-sdk";
// import { createWalletClient, custom } from "viem";
// import { mainnet } from "viem/chains";

// OLD LOGIC
// Add this error handler function
// const handleSigningError = (error) => {
//   if (error.code === 4001) return "User rejected the request";
//   if (error.message?.includes("User denied")) return "Signature rejected";
//   if (error.message?.includes("insufficient funds"))
//     return "Insufficient ETH for gas";
//   return "Signing failed. Please try again";
// };

// export const usePdfSigner = () => {
//   const [signingStatus, setSigningStatus] = useState("idle");
//   const [signatureData, setSignatureData] = useState(null);
//   const [error, setError] = useState(null);

//   // Old Logic
//   const signPdf = async (file, walletAddress) => {
//     try {
//       setSigningStatus("preparing");
//       setError(null);

//       // 1. Verify window.ethereum exists
//       if (!window.ethereum) {
//         throw new Error("Ethereum provider not found");
//       }

//       // 2. Prepare the file
//       const arrayBuffer = await file.arrayBuffer();
//       const uint8Array = new Uint8Array(arrayBuffer);

//       // 3. Initialize clients
//       const walletClient = createWalletClient({
//         chain: mainnet,
//         transport: custom(window.ethereum),
//       });

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
//       console.error("Signing error:", err); // Log original error
//       setError(formattedError);
//       setSigningStatus("error");
//       throw formattedError;
//     }
//   };

//   // const signPdf = async (file, walletAddress) => {
//   //   try {
//   //     setStatus("preparing");
//   //     setError(null);

//   //     // 1. Prepare file
//   //     const arrayBuffer = await file.arrayBuffer();
//   //     const uint8Array = new Uint8Array(arrayBuffer);

//   //     // 2. Initialize clients
//   //     const walletClient = createWalletClient({
//   //       chain: mainnet,
//   //       transport: custom(window.ethereum),
//   //     });

//   //     const ethSign = new Ethereum();

//   //     // 3. Sign document
//   //     setStatus("signing");
//   //     const response = await ethSign.signDocument({
//   //       walletClient,
//   //       data: uint8Array,
//   //       name: file.name,
//   //       signaturePayload: {
//   //         name: "PDF Signer DApp",
//   //         version: "1.0",
//   //       },
//   //     });

//   //     // 4. Store results
//   //     setSignatureData({
//   //       signature: response.signature,
//   //       documentId: response.documentId,
//   //       txHash: response.transactionHash,
//   //     });
//   //     setStatus("success");

//   //     return response;
//   //   } catch (err) {
//   //     console.error("Signing error:", err);
//   //     setError(err);
//   //     setStatus("error");
//   //     throw err;
//   //   }
//   // };

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

// src/hooks/usePdfSigner.js (FINAL WORKING VERSION)
// import { useState } from "react";
// import { Ethereum } from "@ethsign/sp-sdk";
// import { createWalletClient, custom } from "viem";
// import { mainnet } from "viem/chains";

// // Add this at module level
// if (typeof window === "undefined") {
//   throw new Error("This hook requires browser environment");
// }

// export default function usePdfSigner() {
//   const [status, setStatus] = useState("idle");
//   const [signatureData, setSignatureData] = useState(null);
//   const [error, setError] = useState(null);

//   const signPdf = async (file) => {
//     try {
//       // 1. Validate environment
//       if (!window.ethereum?.isMetaMask) {
//         throw new Error("MetaMask not detected");
//       }

//       // 2. Prepare file
//       setStatus("preparing");
//       const arrayBuffer = await file.arrayBuffer();
//       const uint8Array = new Uint8Array(arrayBuffer);

//       // 3. Initialize clients
//       const walletClient = createWalletClient({
//         chain: mainnet,
//         transport: custom(window.ethereum),
//       });

//       const ethSign = new Ethereum();

//       // 4. Sign document
//       setStatus("signing");
//       const response = await ethSign.signDocument({
//         walletClient,
//         data: uint8Array,
//         name: file.name,
//         signaturePayload: {
//           name: "PDF Signer DApp",
//           version: "1.0",
//         },
//       });

//       // 5. Store results
//       setSignatureData({
//         signature: response.signature,
//         documentId: response.documentId,
//         transactionHash: response.transactionHash,
//       });
//       setStatus("success");

//       return response;
//     } catch (err) {
//       console.error("Signing error:", err);
//       setError(err);
//       setStatus("error");
//       throw err;
//     }
//   };

//   return {
//     signPdf,
//     status,
//     signatureData,
//     error,
//     reset: () => {
//       setStatus("idle");
//       setSignatureData(null);
//       setError(null);
//     },
//   };
// }

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

  return { signPdf, status, signatureData, error, reset };
}
