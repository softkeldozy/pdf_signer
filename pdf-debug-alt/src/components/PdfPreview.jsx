import { useState, useEffect, useRef } from "react";

export default function PdfPreview({ file, onLoadError }) {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!file) return;

    setIsLoading(true);
    const url = URL.createObjectURL(file);

    // Chrome/Firefox can display PDFs directly in iframes
    const iframe = iframeRef.current;
    iframe.src = url + "#toolbar=0&navpanes=0"; // Hide PDF controls

    const handleLoad = () => {
      setIsLoading(false);
      // onLoadSuccess();
    };

    const handleError = () => {
      setIsLoading(false);
      URL.revokeObjectURL(url);
      onLoadError?.(new Error("Failed to load PDF"));
    };

    iframe.src = url;
    iframe.addEventListener("load", handleLoad);
    iframe.addEventListener("error", handleError);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      iframe.removeEventListener("error", handleError);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner" />
          <p>Loading PDF preview...</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="PDF Preview"
        style={{
          width: "100%",
          height: "500px",
          border: "none",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          display: isLoading ? "none" : "block",
        }}
      />
    </div>
  );
}
