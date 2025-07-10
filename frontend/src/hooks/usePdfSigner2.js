import { useState, useEffect, useCallback } from "react";
import { Buffer } from "buffer";
import { SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { createWalletClient, createPublicClient, http } from "viem";
import { uploadPDFToBackend } from "./uploadPDFToBackend";
import { Web3Provider } from "@ethersproject/providers";
import { keccak256 } from "viem";
import { mainnet } from "viem/chains";
import axios from "axios";

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
      const rpcUrl =
        "https://eth-mainnet.g.alchemy.com/v2/TjFTLeEiYoZZznTXK99sU";
      // const rpcUrl = import.meta.env.VITE_ALCHEMY_SEPOLIA_RPC_URL;
      if (!rpcUrl) throw new Error("RPC URL is missing from environment");

      const provider = new Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const walletClient = createWalletClient({
        chain: mainnet,
        transport: http(rpcUrl),
        account: address,
      });

      const client = new SignProtocolClient(walletClient, {
        mode: SpMode.OnChain,
        // chain: sepolia,
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
    async (file, address, onComplete) => {
      let fileUrl;
      try {
        setState((prev) => ({ ...prev, status: "uploading" }));
        //  1. Upload first
        fileUrl = await uploadPDFToBackend(file);
        if (!fileUrl) throw new Error("No URL returned from backend");

        setState((prev) => ({ ...prev, status: "signing" }));

        //  2. Initialize SDK (SignProtocolClient)
        const client = await initializeSDK();

        //  3.Read file and Hash the file (you’re already doing this)
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const fileHash = keccak256(uint8Array); // returns 0x..
        const filename = file.name;
        const signedAt = new Date().toISOString();

        //  4. Prompt wallet signature with URL in data

        const result = await client.createAttestation({
          schemaId: 0x2419,
          data: {
            deploy: fileUrl,
          },
        });

        // 5. Send metadata to /documents
        await axios.post("http://localhost:5000/documents", {
          fileUrl,
          filename,
          signer: address,
          signedAt,
          hash: fileHash,
        });

        // Call the callback to fetch updated list
        if (onComplete) {
          await onComplete((prev) => prev + 1);
        }

        //  6. Update state: success
        setState((prev) => ({
          ...prev,
          status: "success",
          signatureData: result,
        }));

        return result;
      } catch (error) {
        // ⚠️ If signing failed, remove uploaded file
        if (fileUrl) {
          try {
            await axios.post("http://localhost:5000/delete-upload", {
              fileUrl: fileUrl,
            });
          } catch (deleteError) {
            toast.error("Failed to delete upload file: ", deleteError);
          }
        }

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
