import { useState, useEffect } from "react";

const useDocumentHistory = () => {
  const [documents, setDocuments] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedDocs = JSON.parse(
      localStorage.getItem("signedDocuments") || "[]"
    );
    setDocuments(savedDocs);
  }, []);
  const addDocument = (doc) => {
    const updated = [
      ...documents,
      {
        ...doc,
        timestamp: new Date().toISOString(),
      },
    ];
    setDocuments(updatedDocs);
    localStorage.setItem("signedDocuments", JSON.stringify(updatedDocs));
  };

  const clearHistory = () => {
    setDocuments([]);
    localStorage.removeItem("signedDocuments");
  };

  return { documents, addDocument, clearHistory };
};

export default useDocumentHistory;
