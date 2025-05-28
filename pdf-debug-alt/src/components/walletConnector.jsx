import { useState, useEffect } from "react";

export default function WalletConnector({ onConnect }) {
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      setError(null);

      // 1. Basic provider check
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      // 2. Direct Ethereum request (bypass viem temporarily)
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      // 3. Return the first account
      onConnect(accounts[0]);
    } catch (err) {
      console.error("Connection error:", err);
      setError(err.code === 4001 ? "Connection rejected" : err.message);
    }
  };

  return (
    <div>
      <button
        onClick={connectWallet}
        style={{
          padding: "10px 20px",
          background: "#3f51b5",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Connect Wallet
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}
