export default function DocumentHistory({ documents, onSelect }) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "16px",
        marginTop: "20px",
      }}
    >
      <h3>Your Signed Documents</h3>
      {documents.length === 0 ? (
        <p>No history yet</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {documents.map((doc, index) => (
            <li
              key={index}
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
              onClick={() => onSelect(doc)}
            >
              <strong>{doc.name}</strong>
              <div style={{ fontSize: "0.8em", color: "#666" }}>
                {new Date(doc.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
