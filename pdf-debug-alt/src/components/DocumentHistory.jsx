const DocumentHistory = ({ documents, clearHistory }) => {
  if (documents.length === 0) return null;

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Your Signed Documents</h2>
        <button
          className="btn btn-outline"
          onClick={clearHistory}
          style={{ fontSize: "0.8rem" }}
        >
          Clear History
        </button>
      </div>
      <div style={{ marginTop: "1rem" }}>
        {documents.map((doc) => (
          <div
            key={doc.id}
            style={{
              padding: "1rem",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p>
                <strong>{doc.name}</strong>
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--gray)" }}>
                {new Date(doc.date).toLocaleString()}
              </p>
            </div>
            <div>
              <a
                href={`https://app.ethsign.xyz/sign/${doc.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.8rem" }}
              >
                View
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentHistory;
