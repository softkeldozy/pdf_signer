import { useState, useEffect } from "react";

const PdfPreview = ({ file }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (!pdfUrl) return null;

  return (
    <div className="card">
      <h2>Document Preview</h2>
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "var(--border-radius)",
          overflow: "hidden",
          marginTop: "1rem",
        }}
      >
        <iframe
          src={pdfUrl}
          title="PDF Preview"
          style={{
            width: "100%",
            height: "500px",
            border: "none",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        <span style={{ color: "var(--gray)" }}>
          Pages: Loading... {/* You can enhance this with pdf-lib if needed */}
        </span>
        <span style={{ color: "var(--gray)" }}>
          Size: {(file.size / 1024).toFixed(2)} KB
        </span>
      </div>
    </div>
  );
};

export default PdfPreview;
