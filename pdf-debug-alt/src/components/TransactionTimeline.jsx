export default function TransactionTimeline({ currentStep }) {
  const steps = ["PDF Loaded", "Signature Placed", "Blockchain Confirmed"];

  return (
    <div className="space-y-2 mt-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center 
            ${currentStep > index ? "bg-green-500" : "bg-gray-300"}`}
          >
            {currentStep > index ? "✓" : index + 1}
          </div>
          <span className="ml-2">{step}</span>
        </div>
      ))}
    </div>
  );
}
