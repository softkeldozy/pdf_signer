// import { useState, useEffect } from "react";
// import { format } from "date-fns";
// import "../styles/dochistory.css";

// export default function DocumentHistory() {
//   const [documents, setDocuments] = useState([]);

//   useEffect(() => {
//     async function fetchDocuments() {
//       try {
//         const response = await fetch("http://localhost:5000/documents");
//         const data = await response.json();
//         setDocuments(data);
//       } catch (error) {
//         console.error("Failed to fetch documents:", error);
//       }
//     }

//     fetchDocuments();
//   }, []);

//   return (
//     <div className="document-history">
//       <h3>Document History</h3>
//       {documents.length === 0 ? (
//         <p>No signed documents found.</p>
//       ) : (
//         <ul className="history-list">
//           {documents.map((doc, index) => (
//             <li key={index} className="history-item">
//               <p>
//                 <strong>Filename:</strong> {doc.filename}
//               </p>
//               <p>
//                 <strong>Signer:</strong> {doc.signer}
//               </p>
//               <p>
//                 <strong>Signed At:</strong>{" "}
//                 {format(new Date(doc.signedAt), "PPPppp")}
//               </p>
//               <p>
//                 <strong>Hash:</strong> {doc.hash}
//               </p>
//               <p>
//                 <strong>View:</strong>{" "}
//                 <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
//                   Open PDF
//                 </a>
//               </p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import useDocumentStore from "../hooks/store/documentStore";
import { format } from "date-fns";
import "../styles/dochistory.css";

export default function DocumentHistory({ onSelectDocument, selectedDocId }) {
  const { documents, fetchDocuments } = useDocumentStore();
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 3;

  useEffect(() => {
    fetchDocuments(); // Fetch when component mounts
  }, [fetchDocuments]);

  // Pagination calculations
  const indexOfLastDoc = currentPage * docsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
  const currentDocs = documents.slice(indexOfFirstDoc, indexOfLastDoc);
  const totalPages = Math.ceil(documents.length / docsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="document-history">
      <h3>Document History</h3>
      <ul className="history-list">
        {currentDocs.map((doc, i) => (
          <li
            key={doc.timestamp || i}
            className={`history-item ${
              selectedDocId === doc.id ? "selected" : ""
            }`}
            onClick={() => onSelectDocument(doc.id)}
          >
            <div>
              <strong>{doc.filename}</strong>
            </div>
            <div>Signer: {doc.signer}</div>
            <div>Signed: {new Date(doc.signedAt).toLocaleString()}</div>
            <div>Hash: {doc.hash}</div>
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="file-link"
            >
              View PDF
            </a>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div className="pagination-controls">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={pageNum === currentPage ? "active-page" : ""}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
}
