import { useState } from "react";

export default function WalletButton({
  onConnect,
  onDisconnect,
  isConnected,
  address,
}) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Verify provider exists
      if (!window.ethereum) {
        throw new Error("MetaMask not detected!");
      }

      // 2. Request accounts
      const accounts = await window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .catch((err) => {
          // Handle user rejection explicitly
          if (err.code === 4001) throw new Error("Connection rejected by user");
          throw err;
        });

      // 3. Validate response
      if (!accounts?.[0]) {
        throw new Error("No accounts returned");
      }

      // 4. Update parent state
      onConnect(accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setError(err.message || "Connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "15px",
        margin: "18px",
        border: "1px solid #e0e0e0",
        borderRadius: "80px",
        marginBottom: "20px",
        width: "95%",
      }}
    >
      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: "10px",
            background: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>
      )}

      {/* Connection UI */}
      {isConnected ? (
        <div>
          <p className="addyTxt">Connected: {address}</p>
          <button
            className="walletBtn"
            onClick={onDisconnect}
            style={{
              padding: "8px 16px",
              background: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          className="walletBtn"
          onClick={handleConnect}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            background: isLoading ? "#9e9e9e" : "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}
