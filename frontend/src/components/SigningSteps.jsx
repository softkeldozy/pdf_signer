const steps = [
  {
    id: 1,
    name: "Connect Wallet",
    description: "Connect your Ethereum wallet",
  },
  { id: 2, name: "Upload PDF", description: "Select the document to sign" },
  { id: 3, name: "Sign", description: "Approve the transaction" },
  { id: 4, name: "Complete", description: "View your signed document" },
];

const SigningSteps = ({ currentStep }) => {
  return (
    <div className="card">
      <h2>Signing Process</h2>
      <div className="steps-container">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`step ${currentStep >= step.id ? "active" : ""} ${
              currentStep > step.id ? "completed" : ""
            }`}
          >
            <div className="step-number">{step.id}</div>
            <div className="step-content">
              <h3>{step.name}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .step {
          display: flex;
          gap: 1rem;
          opacity: 0.6;
        }
        .step.active {
          opacity: 1;
        }
        .step.completed .step-number {
          background-color: var(--success);
          color: white;
        }
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--light);
          color: var(--dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
          transition: var(--transition);
        }
        .step-content {
          flex-grow: 1;
        }
        .step-content h3 {
          margin-bottom: 0.25rem;
          font-size: 1.1rem;
        }
        .step-content p {
          color: var(--gray);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default SigningSteps;
