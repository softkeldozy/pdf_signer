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
            <p className="txtFilename">
              <strong>{doc.filename}</strong>
            </p>
            <p className="txtSigner">Signer: {doc.signer}</p>
            <p className="txtSigned">
              Signed: {new Date(doc.signedAt).toLocaleString()}
            </p>
            <p className="txtHash">Hash: {doc.hash}</p>
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
