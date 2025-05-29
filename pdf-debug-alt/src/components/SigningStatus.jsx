// Enhanced SigningStatus.jsx
export default function SigningStatus({ status, txHash, documentId }) {
  const statusSteps = [
    {
      id: 1,
      name: "Uploaded",
      active: ["preparing", "signing", "success"].includes(status),
    },
    { id: 2, name: "Signing", active: ["signing", "success"].includes(status) },
    { id: 3, name: "Completed", active: status === "success" },
  ];

  return (
    <div className="status-tracker">
      {statusSteps.map((step) => (
        <div key={step.id} className={`step ${step.active ? "active" : ""}`}>
          <div className="step-number">{step.id}</div>
          <div className="step-name">{step.name}</div>
        </div>
      ))}

      {txHash && (
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
          View Transaction
        </a>
      )}
    </div>
  );
}
