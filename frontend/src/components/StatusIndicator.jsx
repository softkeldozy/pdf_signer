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

      {/* error display here */}
      {status === "error" && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            padding: "1rem",
            borderRadius: "var(--border-radius)",
            marginTop: "1rem",
            color: "var(--danger)",
          }}
        >
          <p>
            <strong>Error:</strong> {error?.message || "Signing failed"}
          </p>

          {/* Conditional error guidance */}
          {error?.message?.includes("Insufficient funds") && (
            <p style={{ marginTop: "0.5rem" }}>
              Please add ETH to your wallet to cover transaction fees
            </p>
          )}
          {error?.message?.includes("gas") && (
            <p style={{ marginTop: "0.5rem" }}>
              Try reducing the file size or waiting for lower network congestion
            </p>
          )}
          {error?.message?.includes("rejected") && (
            <p style={{ marginTop: "0.5rem" }}>
              You need to approve the transaction in your wallet
            </p>
          )}
        </div>
      )}

      {status === "success" && signatureData && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Document ID:</strong> {signatureData.documentId}
          </p>
          <p>
            <strong>Transaction:</strong>
            <a
              href={`https://etherscan.io/tx/${signatureData.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary)", marginLeft: "0.5rem" }}
            >
              View on Etherscan
            </a>
          </p>
          <a
            href={`https://app.ethsign.xyz/sign/${signatureData.documentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ marginTop: "1rem", display: "inline-block" }}
          >
            View Signed Document
          </a>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
