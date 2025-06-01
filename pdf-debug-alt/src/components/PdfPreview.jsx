// import { useState, useEffect, useRef } from "react";

// export default function PdfPreview({ file, onLoadSuccess }) {
//   const iframeRef = useRef(null);
//   const [isRendered, setIsRendered] = useState(false);

//   useEffect(() => {
//     if (!file) return;

//     const url = URL.createObjectURL(file);
//     iframeRef.current.src = url;
//     setIsRendered(false);

//     const handleLoad = () => {
//       setIsRendered(true);
//       onLoadSuccess?.();
//     };

//     const iframe = iframeRef.current;
//     iframe.addEventListener("load", handleLoad);

//     return () => {
//       URL.revokeObjectURL(url);
//       iframe.removeEventListener("load", handleLoad);
//     };
//   }, [file, onLoadSuccess]);

//   return (
//     <div style={{ position: "relative", marginTop: "20px" }}>
//       <iframe
//         ref={iframeRef}
//         title="PDF Preview"
//         style={{
//           width: "100%",
//           height: "500px",
//           border: "1px solid #ddd",
//           borderRadius: "4px",
//           display: isRendered ? "block" : "none",
//         }}
//       />
//       {!isRendered && (
//         <div
//           style={{
//             padding: "40px",
//             textAlign: "center",
//             backgroundColor: "#f8f9fa",
//           }}
//         >
//           Loading PDF preview...
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";

export default function PdfPreview({ file, onLoadSuccess, onLoadError }) {
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
      onLoadSuccess();
    };

    const handleError = () => {
      setIsLoading(false);
      URL.revokeObjectURL(url);
      onLoadError?.(new Error("Failed to load PDF"));
    };

    iframe.src = url;
    iframe.addEventListener("load", handleLoad);
    iframe.addEventListener("error", handleError);

    // iframe.addEventListener("load", handleLoad);
    // iframe.addEventListener("error", handleError);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      iframe.removeEventListener("error", handleError);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="pdf-preview-wrapper">
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
          border: "1px solid #ddd",
          display: isLoading ? "none" : "block",
        }}
      />
    </div>
  );
}
