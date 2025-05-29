// import { useState, useEffect } from "react";

// const useDocumentHistory = () => {
//   const [documents, setDocuments] = useState([]);

//   // Load from localStorage on mount
//   useEffect(() => {
//     const savedDocs = JSON.parse(
//       localStorage.getItem("signedDocuments") || "[]"
//     );
//     setDocuments(savedDocs);
//   }, []);
//   const addDocument = (doc) => {
//     const updated = [
//       ...documents,
//       {
//         ...doc,
//         timestamp: new Date().toISOString(),
//       },
//     ];
//     setDocuments(updatedDocs);
//     localStorage.setItem("signedDocuments", JSON.stringify(updatedDocs));
//   };

//   const clearHistory = () => {
//     setDocuments([]);
//     localStorage.removeItem("signedDocuments");
//   };

//   return { documents, addDocument, clearHistory };
// };

// export default useDocumentHistory;

// src/hooks/useDocumentHistory.js
import { useState, useEffect } from "react";

export default function useDocumentHistory() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("signedDocuments") || "[]");
      // Validate stored data
      const validDocs = saved.filter(
        (doc) => doc.id && doc.name && doc.timestamp
      );
      setDocuments(validDocs);
    } catch (err) {
      console.error("Failed to load history:", err);
      localStorage.removeItem("signedDocuments");
      setDocuments([]);
    }
  }, []);

  const addDocument = (doc) => {
    setDocuments((prev) => {
      // Prevent duplicates
      const exists = prev.some((d) => d.id === doc.id);
      if (exists) return prev;

      const newDocs = [
        {
          ...doc,
          timestamp: doc.timestamp || new Date().toISOString(),
          verified: doc.verified !== false, // Default true
        },
        ...prev, // Newest first
      ].slice(0, 50); // Limit to 50 most recent

      localStorage.setItem("signedDocuments", JSON.stringify(newDocs));
      return newDocs;
    });
  };

  const clearHistory = () => {
    setDocuments([]);
    localStorage.removeItem("signedDocuments");
  };

  return {
    documents,
    addDocument,
    clearHistory,
    count: documents.length,
  };
}
