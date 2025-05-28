export default function SigningStatus({ status, file }) {
  const statusMessages = {
    idle: "Ready to sign",
    preparing: "Preparing document...",
    signing: "Approve transaction in your wallet",
    success: "Document signed successfully!",
    error: "Signing failed",
  };

  return (
    <div
      style={{
        padding: "15px",
        background: "#f5f5f5",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      <h3>Signing Status</h3>
      <div
        style={{
          color: status === "error" ? "#d32f2f" : "#333",
          fontWeight: "bold",
          marginTop: "10px",
        }}
      >
        {statusMessages[status] || statusMessages.idle}
      </div>
      {file && (
        <p style={{ marginTop: "10px" }}>
          File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
        </p>
      )}
    </div>
  );
}
