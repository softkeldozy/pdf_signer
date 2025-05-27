const StatusIndicator = ({ status, file }) => {
  const getStatusData = () => {
    switch (status) {
      case "idle":
        return {
          color: "var(--gray)",
          message: "Ready to sign documents",
          icon: "⏳",
        };
      case "uploading":
        return {
          color: "var(--warning)",
          message: "Processing your document",
          icon: "📄",
        };
      case "signing":
        return {
          color: "var(--primary)",
          message: "Approve the transaction in your wallet",
          icon: "✍️",
        };
      case "success":
        return {
          color: "var(--success)",
          message: "Document signed successfully!",
          icon: "✅",
        };
      case "error":
        return {
          color: "var(--danger)",
          message: "Error occurred during signing",
          icon: "❌",
        };
      default:
        return {
          color: "var(--gray)",
          message: "Ready to sign documents",
          icon: "⏳",
        };
    }
  };

  const statusData = getStatusData();

  return (
    <div className="card">
      <h2>Status</h2>
      <div
        className="flex-center gap-2"
        style={{ color: statusData.color, margin: "1rem 0" }}
      >
        <span style={{ fontSize: "1.5rem" }}>{statusData.icon}</span>
        <h3>{statusData.message}</h3>
      </div>
      {file && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>File:</strong> {file.name}
          </p>
          <p>
            <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
