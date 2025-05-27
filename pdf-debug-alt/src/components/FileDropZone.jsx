import { useCallback, useState } from "react";

const FileDropzone = ({ onFileAccepted, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type === "application/pdf") {
      onFileAccepted(file);
    } else {
      alert("Please upload a PDF file");
    }
  };

  return (
    <div className="card">
      <h2>Upload Document</h2>
      {!file ? (
        <div
          className={`dropzone ${isDragging ? "dragging" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: "2px dashed",
            borderColor: isDragging ? "var(--primary)" : "var(--gray)",
            borderRadius: "var(--border-radius)",
            padding: "3rem",
            textAlign: "center",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.7 : 1,
          }}
        >
          <input
            type="file"
            id="file-upload"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={handleChange}
            disabled={disabled}
          />
          <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
            <div className="flex-center gap-2" style={{ marginBottom: "1rem" }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 8L12 3L7 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 3V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Drag & drop your PDF here or click to browse</span>
            </div>
            <p style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
              Only PDF files are accepted
            </p>
          </label>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <p style={{ marginBottom: "1rem" }}>
            <strong>Selected file:</strong> {file.name}
          </p>
          <button
            className="btn btn-outline"
            onClick={() => onFileAccepted(null)}
          >
            Change File
          </button>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
