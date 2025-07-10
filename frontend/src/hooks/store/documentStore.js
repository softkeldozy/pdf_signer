// src/store/documentStore.js
import { create } from "zustand";
import axios from "axios";

const useDocumentStore = create((set) => ({
  documents: [],
  fetchDocuments: async () => {
    try {
      const res = await axios.get("http://localhost:5000/documents");
      set({ documents: res.data });
      console.log("📄 Documents fetched:", res.data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  },
  addDocument: (doc) =>
    set((state) => ({
      documents: [doc, ...state.documents],
    })),
  clearDocuments: () => set({ documents: [] }),
}));

export default useDocumentStore;
