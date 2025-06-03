import "../styles/signingStatus.css";

// export default function SigningStatus({
//   txHash,
//   isReady,
//   isLoading,
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
//         className={`sign-button ${isLoading ? "loading" : ""}`}
//         onClick={onSignClick}
//         disabled={!isReady || isLoading}
//       >
//         {isLoading ? "Signing..." : "Sign Document"}
//       </button>
//     </div>
//   );
// }
// import { useCallback } from "react";

// export default function SigningStatus({
//   txHash,
//   isReady,
//   isLoading,
//   onSignClick,
// }) {
//   const handleClick = useCallback(
//     (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       if (isReady && !isLoading) {
//         onSignClick();
//       }
//     },
//     [isReady, isLoading, onSignClick]
//   );

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
//         className={`sign-button ${isLoading ? "loading" : ""}`}
//         onClick={handleClick}
//         disabled={!isReady || isLoading}
//       >
//         {isLoading ? "Signing..." : "Sign Document"}
//       </button>
//     </div>
//   );
// }

import React, { useCallback } from "react";
import PropTypes from "prop-types";

const SigningStatus = React.memo(
  ({ txHash, isReady, isLoading, onSignClick }) => {
    const handleClick = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        if (isReady && !isLoading) {
          console.log("Sign button legitimately clicked");
          onSignClick();
        } else {
          console.warn("Sign button click ignored due to state");
        }
      },
      [isReady, isLoading, onSignClick]
    );

    return (
      <div
        className="status-tracker"
        onClickCapture={(e) => e.stopPropagation()}
      >
        {txHash && (
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            View Transaction
          </a>
        )}

        <button
          className={`sign-button ${isLoading ? "loading" : ""}`}
          onClick={handleClick}
          disabled={!isReady || isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Signing...
            </>
          ) : (
            "Sign Document"
          )}
        </button>
      </div>
    );
  }
);

SigningStatus.propTypes = {
  txHash: PropTypes.string,
  isReady: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSignClick: PropTypes.func.isRequired,
};

export default SigningStatus;

// import React, { useCallback } from "react";

// const SigningStatus = React.memo(
//   ({ txHash, isReady, isLoading, onSignClick }) => {
//     const handleClick = useCallback(
//       (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         e.nativeEvent.stopImmediatePropagation();

//         if (isReady && !isLoading) {
//           console.log("Sign button legitimately clicked");
//           onSignClick();
//         } else {
//           console.warn("Sign button click ignored due to state");
//         }
//       },
//       [isReady, isLoading, onSignClick]
//     );

//     return (
//       <div
//         className="status-tracker"
//         onClickCapture={(e) => e.stopPropagation()}
//       >
//         {txHash && (
//           <a
//             href={`https://etherscan.io/tx/${txHash}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             onClick={(e) => e.stopPropagation()}
//           >
//             View Transaction
//           </a>
//         )}

//         <button
//           className={`sign-button ${isLoading ? "loading" : ""}`}
//           onClick={handleClick}
//           disabled={!isReady || isLoading}
//           aria-busy={isLoading}
//         >
//           {isLoading ? (
//             <>
//               <span className="spinner" aria-hidden="true" />
//               Signing...
//             </>
//           ) : (
//             "Sign Document"
//           )}
//         </button>
//       </div>
//     );
//   }
// );

// export default SigningStatus;
