// // PDF Hashing & Metadata Generation
// export async function generatePdfHash(file) {
//   const arrayBuffer = await file.arrayBuffer();
//   const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
//   return Buffer.from(hashBuffer).toString("hex");
// }

// // Usage in your main component:
// const pdfHash = await generatePdfHash(loadedPdf);
// Helper function to hash PDF (add to utils/hashPdf.js)
export const hashPdf = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
