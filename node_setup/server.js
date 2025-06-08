// server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
const metadataPath = path.join(__dirname, "documents.json");

// 🧱 Ensure uploads folder exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// 🧱 Ensure documents.json exists or initialize
let documentStore = [];
if (fs.existsSync(metadataPath)) {
  const data = fs.readFileSync(metadataPath);
  try {
    documentStore = JSON.parse(data);
  } catch (err) {
    console.error("Failed to parse existing documents.json. Starting fresh.");
    documentStore = [];
  }
}

//  Serve uploaded PDFs statically
app.use("/uploads", express.static(uploadsDir));

// 🔁 GET all signed documents
app.get("/documents", (req, res) => {
  res.json(documentStore);
});

//  Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `document-${timestamp}${ext}`);
  },
});
const upload = multer({ storage });

//  Upload a PDF file
app.post("/upload", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

  console.log("✅ File uploaded:", fileUrl);
  res.status(200).json({ url: fileUrl });
});

//  Save full metadata after signing
app.post("/documents", (req, res) => {
  const { fileUrl, filename, signer, signedAt, hash } = req.body;

  if (!fileUrl || !filename || !signer || !signedAt) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Overwrite placeholder if it exists
  const index = documentStore.findIndex((doc) => doc.fileUrl === fileUrl);
  if (index !== -1) {
    documentStore[index] = { fileUrl, filename, signer, signedAt, hash };
  } else {
    documentStore.push({ fileUrl, filename, signer, signedAt, hash });
  }

  // Persist to file
  fs.writeFile(metadataPath, JSON.stringify(documentStore, null, 2), (err) => {
    if (err) {
      console.error("❌ Failed to save metadata:", err);
      return res
        .status(500)
        .json({ error: "Failed to save document metadata" });
    }
    console.log("✅ Metadata saved for:", filename);
    res.json({ success: true });
  });
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
