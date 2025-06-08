// src/components/DocumentHistory.jsx
import { useState, useEffect } from "react";
import { format } from "date-fns";
import "../styles/dochistory.css";

// export default function DocumentHistory({
//   documents = [],
//   onSelectDocument,
//   onSelectedDocId,
// }) {
//   const [showClearConfirm, setShowClearConfirm] = useState(false);

//   const handleClear = () => {
//     localStorage.removeItem("signedDocuments");
//     onSelect(null);
//     window.location.reload(); // Refresh to reflect changes
//   };
//   return (
//     <div className="document-history">
//       <h3>Document History</h3>
//       <ul className="history-list">
//         {documents.map((doc) => (
//           <li
//             key={doc.id || doc.timestamp}
//             className={`history-item ${
//               onSelectedDocId === doc.id ? "selected" : ""
//             }`}
//             onClick={() => onSelectDocument(doc.id)}
//           >
//             <div>
//               <strong>
//                 Signed: {new Date(doc.timestamp).toLocaleString()}
//               </strong>
//             </div>
//             {doc.fileUrl && (
//               <div>
//                 <a
//                   href={doc.fileUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="file-link"
//                 >
//                   View PDF
//                 </a>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// src/components/DocumentHistory.jsx

export default function DocumentHistory() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch("http://localhost:5000/documents");
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    }

    fetchDocuments();
  }, []);

  return (
    <div className="document-history">
      <h3>Document History</h3>
      {documents.length === 0 ? (
        <p>No signed documents found.</p>
      ) : (
        <ul className="history-list">
          {documents.map((doc, index) => (
            <li key={index} className="history-item">
              <p>
                <strong>Filename:</strong> {doc.filename}
              </p>
              <p>
                <strong>Signer:</strong> {doc.signer}
              </p>
              <p>
                <strong>Signed At:</strong>{" "}
                {format(new Date(doc.signedAt), "PPPppp")}
              </p>
              <p>
                <strong>Hash:</strong> {doc.hash}
              </p>
              <p>
                <strong>View:</strong>{" "}
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                  Open PDF
                </a>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
