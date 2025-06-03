// import { useState, useEffect, useCallback } from "react";
// import { Buffer } from "buffer";
// import {
//   SignProtocolClient,
//   SpMode,
//   Web3ProviderConnector,
// } from "@ethsign/sp-sdk";

// if (typeof window !== "undefined" && !window.Buffer) {
//   window.Buffer = Buffer;
// }

// export default function usePdfSigner2(options = {}) {
//   const { file = null, walletAddress = null, metadata = {} } = options;

//   const [state, setState] = useState({
//     status: "idle",
//     signatureData: null,
//     error: null,
//     documentPreview: null,
//     isInitializing: false,
//   });

//   // Prepare document preview
//   const prepareDocument = useCallback(
//     async (file) => {
//       try {
//         setState((prev) => ({ ...prev, status: "preparing" }));

//         if (
//           !file?.type?.includes("pdf") &&
//           !file?.name?.toLowerCase().endsWith(".pdf")
//         ) {
//           throw new Error("Only PDF files are supported");
//         }

//         // Clean up previous preview
//         if (state.documentPreview) {
//           URL.revokeObjectURL(state.documentPreview);
//         }

//         const previewUrl = URL.createObjectURL(file);
//         setState((prev) => ({
//           ...prev,
//           documentPreview: previewUrl,
//           status: "ready_for_approval",
//         }));

//         return previewUrl;
//       } catch (err) {
//         setState((prev) => ({
//           ...prev,
//           status: "error",
//           error: {
//             message: err.message || "Failed to prepare document",
//             details: err.stack,
//           },
//         }));
//         throw err;
//       }
//     },
//     [state.documentPreview]
//   );

//   const initializeSDK = useCallback(async () => {
//     try {
//       setState((prev) => ({ ...prev, isInitializing: true }));

//       const connector = new Web3ProviderConnector(window.ethereum); // Assumes MetaMask is injected
//       const client = new SignProtocolClient(connector, {
//         mode: SpMode.OnChain, // Or SpMode.OffChain depending on your use case
//       });

//       await client.connect(); // Establish connection
//       return client;
//     } catch (error) {
//       console.error("SDK initialization error:", error);
//       throw new Error(`SDK initialization failed: ${error.message}`);
//     } finally {
//       setState((prev) => ({ ...prev, isInitializing: false }));
//     }
//   }, []);

//   const signPdf = useCallback(
//     async (file, address, metadata = {}) => {
//       try {
//         setState((prev) => ({ ...prev, status: "signing" }));

//         const client = await initializeSDK();
//         const arrayBuffer = await file.arrayBuffer();
//         const uint8Array = new Uint8Array(arrayBuffer);

//         const signData = {
//           signer: address,
//           data: uint8Array,
//           name: file.name,
//           metadata: {
//             ...metadata,
//             timestamp: new Date().toISOString(),
//           },
//         };

//         const result = await client.createSignRequest(signData);

//         setState((prev) => ({
//           ...prev,
//           status: "success",
//           signatureData: result,
//         }));

//         return result;
//       } catch (error) {
//         setState((prev) => ({
//           ...prev,
//           status: "error",
//           error: {
//             message: error.message,
//             details: error.stack,
//           },
//         }));
//         throw error;
//       }
//     },
//     [initializeSDK]
//   );

//   // Reset state
//   const reset = useCallback(() => {
//     if (state.documentPreview) {
//       URL.revokeObjectURL(state.documentPreview);
//     }
//     setState({
//       status: "idle",
//       signatureData: null,
//       error: null,
//       documentPreview: null,
//       isInitializing: false,
//     });
//   }, [state.documentPreview]);

//   // Cleanup
//   useEffect(() => {
//     return () => {
//       if (state.documentPreview) {
//         URL.revokeObjectURL(state.documentPreview);
//       }
//     };
//   }, [state.documentPreview]);

//   return {
//     ...state,
//     prepareDocument,
//     signPdf,
//     reset,
//     isSdkInitializing: state.isInitializing,
//   };
// }

import { useState, useEffect, useCallback } from "react";
import { Buffer } from "buffer";
import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import { createWalletClient, custom } from "viem";

if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = Buffer;
}

export default function usePdfSigner2(options = {}) {
  const { file = null, walletAddress = null, metadata = {} } = options;

  const [state, setState] = useState({
    status: "idle",
    signatureData: null,
    error: null,
    documentPreview: null,
    isInitializing: false,
  });

  // Prepare document preview
  const prepareDocument = useCallback(
    async (file) => {
      try {
        setState((prev) => ({ ...prev, status: "preparing" }));

        if (
          !file?.type?.includes("pdf") &&
          !file?.name?.toLowerCase().endsWith(".pdf")
        ) {
          throw new Error("Only PDF files are supported");
        }

        // Clean up previous preview
        if (state.documentPreview) {
          URL.revokeObjectURL(state.documentPreview);
        }

        const previewUrl = URL.createObjectURL(file);
        setState((prev) => ({
          ...prev,
          documentPreview: previewUrl,
          status: "ready_for_approval",
        }));

        return previewUrl;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: {
            message: err.message || "Failed to prepare document",
            details: err.stack,
          },
        }));
        throw err;
      }
    },
    [state.documentPreview]
  );

  const initializeSDK = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isInitializing: true }));

      const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.sepolia,
        // The SDK uses window.ethereum by default if account is not provided
        // apiKey: 'your_api_key', // Optional
      });

      return client;
    } catch (error) {
      console.error("SDK initialization error:", error);
      throw new Error(`SDK initialization failed: ${error.message}`);
    } finally {
      setState((prev) => ({ ...prev, isInitializing: false }));
    }
  }, []);

  const signPdf = useCallback(
    async (file, address, metadata = {}) => {
      try {
        setState((prev) => ({ ...prev, status: "signing" }));

        const client = await initializeSDK();
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Required: Replace this with your actual schemaId from the Sign Protocol dashboard
        const schemaId = "0xd9c6"; // 👈 Required: replace with real schema ID

        const result = await client.createRecord({
          schemaId,
          data: {
            signer: address,
            fileName: file.name,
            fileData: Array.from(uint8Array), // Ensure it can be serialized
            ...metadata,
            timestamp: new Date().toISOString(),
          },
          tags: ["pdf", "signature"],
        });

        setState((prev) => ({
          ...prev,
          status: "success",
          signatureData: result,
        }));

        return result;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: {
            message: error.message,
            details: error.stack,
          },
        }));
        throw error;
      }
    },
    [initializeSDK]
  );

  const reset = useCallback(() => {
    if (state.documentPreview) {
      URL.revokeObjectURL(state.documentPreview);
    }
    setState({
      status: "idle",
      signatureData: null,
      error: null,
      documentPreview: null,
      isInitializing: false,
    });
  }, [state.documentPreview]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (state.documentPreview) {
        URL.revokeObjectURL(state.documentPreview);
      }
    };
  }, [state.documentPreview]);

  return {
    ...state,
    prepareDocument,
    signPdf,
    reset,
    isSdkInitializing: state.isInitializing,
  };
}
