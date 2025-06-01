// import { useState } from "react";
// import { Buffer } from "buffer";
// window.Buffer = Buffer;

// export default function usePdfSigner() {
//   const [status, setStatus] = useState("idle");
//   const [signatureData, setSignatureData] = useState(null);
//   const [error, setError] = useState(null);
//   const [documentPreview, setDocumentPreview] = useState(null);

//   // Reset all states
//   const reset = () => {
//     setStatus("idle");
//     setSignatureData(null);
//     setError(null);
//     setDocumentPreview(null);
//   };

//   // Prepare document preview
//   const prepareDocument = async (file) => {
//     try {
//       setStatus("preparing");

//       // Create preview URL
//       const previewUrl = URL.createObjectURL(file);
//       setDocumentPreview(previewUrl);

//       setStatus("ready_for_approval");
//       return previewUrl;
//     } catch (err) {
//       setError({ message: "Failed to prepare document" });
//       setStatus("error");
//       throw err;
//     }
//   };

//   const signPdf = async (file, walletAddress, metadata = {}) => {
//     console.log("[1/6] Starting signPdf");

//     // 1. Validate inputs
//     if (!file || !walletAddress) {
//       const error = new Error("Missing required parameters");
//       console.error("[1/6 ERROR]", error.message, { file, walletAddress });
//       throw error;
//     }

//     // 2. Validate file type
//     if (!file.type?.includes("pdf")) {
//       const error = new Error(
//         "Invalid file type - Only PDF files are supported"
//       );
//       console.error("[1/6 ERROR]", error.message, file.type);
//       throw error;
//     }

//     try {
//       setStatus("signing");
//       console.log("[2/6] Converting file to ArrayBuffer");
//       const arrayBuffer = await file.arrayBuffer();
//       const uint8Array = new Uint8Array(arrayBuffer);

//       // 3. Load dependencies
//       console.log("[3/6] Loading dependencies");
//       let EthSign, createWalletClient, custom, sepolia; // Changed to testnet chain

//       try {
//         ({ EthSign } = await import("@ethsign/sp-sdk"));
//         ({ createWalletClient, custom } = await import("viem"));
//         ({ sepolia } = await import("viem/chains")); // Using Sepolia testnet
//       } catch (importError) {
//         const error = new Error("Failed to load required dependencies");
//         console.error("[3/6 ERROR]", error.message, importError);
//         throw error;
//       }

//       // 4. Verify Ethereum provider
//       console.log("[4/6] Creating wallet client");
//       if (!window.ethereum) {
//         const error = new Error("Ethereum provider not found");
//         console.error("[4/6 ERROR]", error.message);
//         throw error;
//       }
//       console.log("[5/6] Initializing signer");
//       const walletClient = createWalletClient({
//         chain: sepolia,
//         transport: custom(window.ethereum),
//       });

//       console.log("[6/6] Signing document");
//       try {
//         // 1. Dynamic import with proper constructor extraction
//         const SDK = await import("@ethsign/sp-sdk");
//         console.log("SDK exports:", Object.keys(SDK)); // Debug actual exports

//         // 2. Flexible constructor access
//         const EthSign =
//           SDK.default?.default || // Handle nested defaults
//           SDK.default || // Standard default export
//           SDK.EthSign; // Named export

//         if (typeof EthSign !== "function") {
//           throw new Error(
//             `EthSign is not a constructor. Got type: ${typeof EthSign}`
//           );
//         }

//         // 3. Initialize with debug
//         console.log("Initializing EthSign with config:", {
//           chain: sepolia,
//           walletClient,
//         });

//         const ethSign = new EthSign(); // Or SDK.createClient() if factory pattern

//         // 4. Sign with retry logic
//         let retries = 3;
//         while (retries > 0) {
//           try {
//             const response = await ethSign.signDocument({
//               walletClient,
//               data: uint8Array,
//               name: file.name,
//               signaturePayload: {
//                 name: "PDF Signer DApp",
//                 version: "1.0",
//                 metadata: {
//                   ...metadata,
//                   timestamp: new Date().toISOString(),
//                   signer: walletAddress,
//                 },
//               },
//             });

//             console.log("[6/6 SUCCESS] Signing complete");
//             setSignatureData(response);
//             setStatus("success");
//             return response;
//           } catch (signError) {
//             retries--;
//             if (retries === 0) throw signError;
//             console.warn(`Retrying signing (${retries} left)...`, signError);
//             await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s
//           }
//         }
//       } catch (err) {
//         console.error("[6/6 CRITICAL ERROR]", {
//           error: err,
//           sdkVersion: await getSDKVersion(), // Add this helper function
//           ethereum: !!window.ethereum,
//           walletReady: !!walletClient,
//         });
//         throw new Error(`Final signing failed: ${err.message}`);
//       }
//       // Helper function to get SDK version
//       async function getSDKVersion() {
//         try {
//           const pkg = await import("@ethsign/sp-sdk/package.json");
//           return pkg.version;
//         } catch {
//           return "unknown";
//         }
//       }
//     } catch (err) {
//       setStatus("error");
//       throw err;
//     }

//     return {
//       prepareDocument,
//       signPdf,
//       status,
//       signatureData,
//       error,
//       reset,
//       documentPreview,
//     };
//   };
// }

import { useState } from "react";
import { Buffer } from "buffer";
window.Buffer = Buffer;

export default function usePdfSigner() {
  const [status, setStatus] = useState("idle");
  const [signatureData, setSignatureData] = useState(null);
  const [error, setError] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);

  // Reset all states
  const reset = () => {
    setStatus("idle");
    setSignatureData(null);
    setError(null);
    setDocumentPreview(null);
  };

  // Prepare document preview
  const prepareDocument = async (file) => {
    try {
      setStatus("preparing");

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setDocumentPreview(previewUrl);

      setStatus("ready_for_approval");
      return previewUrl;
    } catch (err) {
      setError({ message: "Failed to prepare document" });
      setStatus("error");
      throw err;
    }
  };

  // Helper function to get SDK version
  async function getSDKVersion() {
    try {
      const pkg = await import("@ethsign/sp-sdk/package.json");
      return pkg.version;
    } catch {
      return "unknown";
    }
  }

  const signPdf = async (file, walletAddress, metadata = {}) => {
    console.log("[1/6] Starting signPdf");

    // 1. Validate inputs
    if (!file || !walletAddress) {
      const error = new Error("Missing required parameters");
      console.error("[1/6 ERROR]", error.message, { file, walletAddress });
      throw error;
    }

    // 2. Validate file type
    if (!file.type?.includes("pdf")) {
      const error = new Error(
        "Invalid file type - Only PDF files are supported"
      );
      console.error("[1/6 ERROR]", error.message, file.type);
      throw error;
    }

    try {
      setStatus("signing");
      console.log("[2/6] Converting file to ArrayBuffer");
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // 3. Load dependencies
      console.log("[3/6] Loading dependencies");
      let EthSign, createWalletClient, custom, sepolia;

      try {
        ({ createWalletClient, custom } = await import("viem"));
        ({ sepolia } = await import("viem/chains"));
      } catch (importError) {
        const error = new Error("Failed to load required dependencies");
        console.error("[3/6 ERROR]", error.message, importError);
        throw error;
      }

      // 4. Verify Ethereum provider
      console.log("[4/6] Creating wallet client");
      if (!window.ethereum) {
        const error = new Error("Ethereum provider not found");
        console.error("[4/6 ERROR]", error.message);
        throw error;
      }

      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });

      // 5. Initialize EthSign
      console.log("[5/6] Initializing signer");
      try {
        const SDK = await import("@ethsign/sp-sdk");
        console.log("SDK exports:", Object.keys(SDK));

        // Flexible constructor access
        const EthSign = SDK.default?.default || SDK.default || SDK.EthSign;

        if (typeof EthSign !== "function") {
          throw new Error(
            `EthSign is not a constructor. Got type: ${typeof EthSign}`
          );
        }

        const ethSign = new EthSign();

        // 6. Sign document
        console.log("[6/6] Signing document");
        let retries = 3;
        while (retries > 0) {
          try {
            const response = await ethSign.signDocument({
              walletClient,
              data: uint8Array,
              name: file.name,
              signaturePayload: {
                name: "PDF Signer DApp",
                version: "1.0",
                metadata: {
                  ...metadata,
                  timestamp: new Date().toISOString(),
                  signer: walletAddress,
                },
              },
            });

            console.log("[6/6 SUCCESS] Signing complete");
            setSignatureData(response);
            setStatus("success");
            return response;
          } catch (signError) {
            retries--;
            if (retries === 0) throw signError;
            console.warn(`Retrying signing (${retries} left)...`, signError);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      } catch (err) {
        console.error("[5/6 ERROR] Initialization failed", {
          error: err,
          sdkVersion: await getSDKVersion(),
          ethereum: !!window.ethereum,
        });
        throw new Error(`Initialization failed: ${err.message}`);
      }
    } catch (err) {
      console.error("Signing process failed:", err);
      setStatus("error");
      setError({
        message: err.message,
        details: err instanceof Error ? err.stack : undefined,
      });
      throw err;
    }
  };

  return {
    prepareDocument,
    signPdf,
    status,
    signatureData,
    error,
    reset,
    documentPreview,
  };
}
