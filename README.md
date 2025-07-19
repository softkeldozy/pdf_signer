# 📄 Sign Protocol PDF Signing DApp

A decentralized application that enables **secure PDF signing on-chain using Sign Protocol SDK**, with **document upload, signing, verification, and history tracking** on a blockchain network (Base Sepolia / Sign Protocol testnet).

Deployed:
👉 [Live on Vercel](https://pdf-signer-e5te-git-main-softkeldozys-projects.vercel.app/)

---

## 📂 Project Structure

```plaintext

├── /src
│   ├── /components       # React components (WalletButton, DocumentHistory, etc.)
│   ├── /hooks            # React hooks (usePdfSigner, Zustand stores)
│   ├── /styles           # CSS/Tailwind files
│   ├── App1.jsx          # Main App component
│   └── main.jsx
├── /server               # Express backend for uploads
├── /public               # Static assets
├── vite.config.js        # Vite configuration with polyfills

```

## ✨ Features

✅ Upload PDF files and hash on-chain  
✅ Sign PDFs using your connected wallet (MetaMask, etc.)  
✅ Store signed documents on IPFS / Arweave  
✅ Verify PDF signatures  
✅ Display signed document history  
✅ Fully responsive and mobile-friendly  
✅ Toast notifications for user feedback  
✅ Animation and clear UI feedback during signing  
✅ Uses **Sign Protocol SDK**, **ViEM**, **React**, **Vite**,

---

## 🚀 Tech Stack

- **React (Vite)**
- **Sign Protocol SDK**
- **ViEM for wallet connections
- **Express.js** backend for file uploads
- **Date-fns, axios, ethers** for utilities
- **Vercel** for frontend deployment

---

## 🛠️ Local Development

### 1️⃣ Clone the repository:
`git clone https://github.com/softkeldozy/pdf-signer.git`

`cd pdf-signer`

---

### 2️⃣ Install dependencies:
Using Yarn:

`yarn install`

Or using npm:

`npm install`

---

### 3️⃣ Set up environment variables:
Create a .env file:

`VITE_APP_BACKEND_URL=http://localhost:5000`

`VITE_APP_SIGN_PROTOCOL_KEY=your_sign_protocol_key`

---

### 4️⃣ Run the frontend:
`yarn dev`
or
`npm run dev`

---

### 5️⃣ Run the backend server:
Navigate to your server directory and run:

`node server.js`

---

## ✅ Completed Functionality
- Upload and preview PDF

- Sign PDF on-chain with Sign Protocol

- Verify signed PDFs

- Transaction timeline animation

- Mobile responsive UI

- Wallet connection and error handling with toasts

- Cleanup and rollback file uploads on transaction rejection

- Smooth user experience

## 📝 License
MIT License © 2025

🤝 Contributions
PRs and issue reports are welcome!

Built with 💚 using Sign Protocol to empower secure, decentralized document signing on-chain.
