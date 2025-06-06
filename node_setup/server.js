// server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Enable CORS for development
app.use(cors());

// Set up static folder to serve uploaded PDFs
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads folder exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `document-${timestamp}${ext}`);
  },
});

const upload = multer({ storage });

// POST route to handle PDF uploads
app.post("/upload", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });

  // Serve uploaded PDFs statically
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
