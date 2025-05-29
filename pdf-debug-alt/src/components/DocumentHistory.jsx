// src/components/DocumentHistory.jsx
import { useState } from "react";
import { format } from "date-fns";

export default function DocumentHistory({ documents, onSelect }) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClear = () => {
    localStorage.removeItem("signedDocuments");
    onSelect(null);
    window.location.reload(); // Refresh to reflect changes
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "16px",
        background: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h3 style={{ margin: 0 }}>Document History</h3>
        {documents.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            style={{
              background: "none",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {showClearConfirm && (
        <div
          style={{
            padding: "12px",
            background: "#ffebee",
            borderRadius: "4px",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Are you sure?</span>
          <div>
            <button
              onClick={handleClear}
              style={{
                marginRight: "8px",
                background: "#ef4444",
                color: "white",
              }}
            >
              Confirm
            </button>
            <button onClick={() => setShowClearConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <p style={{ color: "#64748b", textAlign: "center" }}>
          No documents yet
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {documents.map((doc) => (
            <li
              key={doc.id}
              onClick={() => onSelect(doc)}
              style={{
                padding: "12px 8px",
                borderBottom: "1px solid #f1f5f9",
                cursor: "pointer",
                ":hover": {
                  background: "#f8fafc",
                },
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <strong
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "180px",
                  }}
                >
                  {doc.name}
                </strong>
                <span
                  style={{
                    color: "#64748b",
                    fontSize: "0.8em",
                  }}
                >
                  {format(new Date(doc.timestamp), "MMM d, yyyy")}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    background: doc.verified ? "#10b981" : "#ef4444",
                    borderRadius: "50%",
                    marginRight: "6px",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.8em",
                    color: doc.verified ? "#10b981" : "#ef4444",
                  }}
                >
                  {doc.verified ? "Verified" : "Pending"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
