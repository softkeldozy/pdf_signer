// import "../styles/signingStatus.css";

// export default function SigningStatus({
//   address,
//   txHash,
//   isReadyToSign,
//   onSignClick,
// }) {
//   return (
//     <div className="status-tracker">
//       {txHash && (
//         <a
//           href={`https://etherscan.io/tx/${txHash}`}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           View Transaction
//         </a>
//       )}

//       <button
//         className="sign-button"
//         onClick={onSignClick}
//         disabled={!isReadyToSign || !address}
//       >
//         Sign Document
//       </button>
//     </div>
//   );
// }
import "../styles/signingStatus.css";

export default function SigningStatus({
  address,
  txHash,
  isReadyToSign,
  onSignClick,
}) {
  return (
    <div className="status-tracker">
      {txHash && (
        <a
          href={`https://etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Transaction
        </a>
      )}

      <button
        className="sign-button"
        onClick={onSignClick}
        disabled={!isReadyToSign || !address}
      >
        Sign Document
      </button>
    </div>
  );
}
