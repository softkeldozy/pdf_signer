// src/hooks/usePdfSigner.js (TEST VERSION)
import { useState } from "react";

export default function usePdfSigner() {
  const [status, setStatus] = useState("idle");

  const signPdf = async (file) => {
    console.log("Mock signing:", file.name);
    setStatus("signing");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus("success");
    return { mock: true };
  };

  return {
    signPdf,
    status,
    signatureData: null,
    error: null,
    reset: () => setStatus("idle"),
  };
}
