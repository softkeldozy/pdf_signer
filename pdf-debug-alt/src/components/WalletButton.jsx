// // WalletButton.jsx
// import { useState, useEffect } from "react";
// import { createWalletClient, custom } from "viem";
// import { mainnet } from "viem/chains";

// const WalletButton = ({ isConnected, address, onConnect, onDisconnect }) => {
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [error, setError] = useState(null);

//   const connectWallet = async () => {
//     try {
//       setIsConnecting(true);
//       setError(null);

//       if (!window.ethereum) {
//         throw new Error("Ethereum wallet not detected");
//       }

//       const walletClient = createWalletClient({
//         chain: mainnet,
//         transport: custom(window.ethereum),
//       });

//       // Verify chain
//       const chainId = await walletClient.getChainId();
//       if (chainId !== mainnet.id) {
//         throw new Error(`Please switch to ${mainnet.name}`);
//       }

//       const [address] = await walletClient.requestAddresses();
//       if (!address) throw new Error("No accounts found");

//       onConnect(address);
//     } catch (err) {
//       console.error("Connection failed:", err);
//       setError(err.message);
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   useEffect(() => {
//     if (!window.ethereum) return;

//     const handleDisconnect = () => onDisconnect?.();
//     window.ethereum.on("accountsChanged", handleDisconnect);

//     return () => {
//       window.ethereum?.removeListener("accountsChanged", handleDisconnect);
//     };
//   }, []);

//   return (
//     <div className="wallet-connector">
//       {error && <div className="error">{error}</div>}

//       {isConnected ? (
//         <div className="wallet-connected">
//           <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
//           <button onClick={onDisconnect}>Disconnect</button>
//         </div>
//       ) : (
//         <button
//           onClick={connectWallet}
//           disabled={isConnecting}
//           id="connect-wallt"
//         >
//           {isConnecting ? "Connecting..." : "Connect Wallet"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default WalletButton;

// import { useState, useEffect } from "react";
// import { createWalletClient, custom, getAccount } from "viem";
// import { mainnet } from "viem/chains";

// const WalletButton = ({ isConnected, address, onConnect, onDisconnect }) => {
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [error, setError] = useState(null);

//   const handleConnect = async () => {
//     try {
//       setIsConnecting(true);
//       setError(null);

//       // 1. Verify Ethereum provider exists
//       if (!window.ethereum) {
//         throw new Error("Please install MetaMask or another Ethereum wallet");
//       }

//       // 2. Create wallet client
//       const walletClient = createWalletClient({
//         chain: mainnet,
//         transport: custom(window.ethereum),
//       });

//       // 3. Verify correct network
//       const chainId = await walletClient.getChainId();
//       if (chainId !== mainnet.id) {
//         await walletClient.switchChain({ id: mainnet.id });
//       }

//       // 4. Get accounts with proper error handling
//       const accounts = await window.ethereum
//         .request({
//           method: "eth_requestAccounts",
//         })
//         .catch((err) => {
//           throw new Error(err.message || "Failed to get accounts");
//         });

//       if (!accounts || accounts.length === 0) {
//         throw new Error("No accounts found");
//       }

//       // 5. Verify account using viem's getAccount
//       const account = getAccount(accounts[0]);
//       if (!account) {
//         throw new Error("Invalid account format");
//       }

//       // 6. Update parent component
//       onConnect(account.address);
//     } catch (err) {
//       console.error("Connection error:", err);
//       setError(
//         err.code === 4001
//           ? "Connection rejected by user"
//           : err.message || "Connection failed"
//       );
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   // Handle account/chain changes
//   useEffect(() => {
//     if (!window.ethereum || !isConnected) return;

//     const handleAccountsChanged = (accounts) => {
//       if (accounts.length === 0) onDisconnect();
//     };

//     const handleChainChanged = () => window.location.reload();

//     window.ethereum.on("accountsChanged", handleAccountsChanged);
//     window.ethereum.on("chainChanged", handleChainChanged);

//     return () => {
//       window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
//       window.ethereum?.removeListener("chainChanged", handleChainChanged);
//     };
//   }, [isConnected]);

//   return (
//     <div className="wallet-connector">
//       {error && <div className="error-message">{error}</div>}

//       {isConnected ? (
//         <div className="connected-account">
//           <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
//           <button onClick={onDisconnect}>Disconnect</button>
//         </div>
//       ) : (
//         <button onClick={handleConnect} disabled={isConnecting}>
//           {isConnecting ? "Connecting..." : "Connect Wallet"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default WalletButton;

// import { useState, useEffect } from "react";
// import { createWalletClient, custom, getAccount } from "viem";
// import { mainnet } from "viem/chains";

// const WalletButton = ({ isConnected, address, onConnect, onDisconnect }) => {
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [error, setError] = useState(null);

//   // Simple connection method from working version
//   const basicConnect = async () => {
//     try {
//       const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });
//       return accounts[0];
//     } catch (err) {
//       throw err;
//     }
//   };

//   // Enhanced validation from previous version
//   const enhancedConnect = async () => {
//     const walletClient = createWalletClient({
//       chain: mainnet,
//       transport: custom(window.ethereum),
//     });

//     const chainId = await walletClient.getChainId();
//     if (chainId !== mainnet.id) {
//       await walletClient.switchChain({ id: mainnet.id });
//     }

//     const account = getAccount(await basicConnect());
//     if (!account) throw new Error("Invalid account");
//     return account.address;
//   };

//   const handleConnect = async () => {
//     try {
//       setIsConnecting(true);
//       setError(null);

//       if (!window.ethereum) {
//         throw new Error("Please install MetaMask");
//       }

//       const address = await enhancedConnect();
//       onConnect(address);
//     } catch (err) {
//       console.error("Connection error:", err);
//       setError(
//         err.code === 4001
//           ? "Connection rejected"
//           : err.message || "Connection failed"
//       );
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   useEffect(() => {
//     if (!window.ethereum || !isConnected) return;

//     const handleAccountsChanged = (accounts) => {
//       if (accounts.length === 0) onDisconnect();
//     };

//     window.ethereum.on("accountsChanged", handleAccountsChanged);
//     return () => {
//       window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
//     };
//   }, [isConnected]);

//   return (
//     <div className="wallet-connector">
//       {error && (
//         <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
//       )}

//       {isConnected ? (
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
//           <button
//             onClick={onDisconnect}
//             style={{
//               padding: "5px 10px",
//               background: "transparent",
//               border: "1px solid #ccc",
//             }}
//           >
//             Disconnect
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={handleConnect}
//           disabled={isConnecting}
//           style={{
//             padding: "10px 20px",
//             background: "#3f51b5",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//           }}
//         >
//           {isConnecting ? "Connecting..." : "Connect Wallet"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default WalletButton;

// import { useState } from "react";

// export default function WalletButton({
//   isConnected,
//   address,
//   onConnect,
//   onDisconnect,
// }) {
//   const [error, setError] = useState(null);

//   // Using the proven simple connection method
//   const handleConnect = async () => {
//     try {
//       setError(null);

//       // 1. Basic provider check
//       if (!window.ethereum) {
//         throw new Error("Please install MetaMask!");
//       }

//       // 2. Direct Ethereum request (bypass viem)
//       const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });

//       if (!accounts?.[0]) {
//         throw new Error("No accounts found");
//       }

//       // 3. Update parent component
//       onConnect(accounts[0]);
//     } catch (err) {
//       console.error("Connection error:", err);
//       setError(
//         err.code === 4001
//           ? "Connection rejected"
//           : err.message || "Connection failed"
//       );
//     }
//   };

//   return (
//     <div
//       style={{
//         padding: "20px",
//         border: "1px solid #eee",
//         borderRadius: "8px",
//         marginBottom: "20px",
//       }}
//     >
//       <h2>Wallet Connection</h2>

//       {error && <p style={{ color: "red", margin: "10px 0" }}>{error}</p>}

//       {isConnected ? (
//         <div style={{ marginTop: "10px" }}>
//           <p>Connected: {address}</p>
//           <button
//             onClick={onDisconnect}
//             style={{
//               padding: "8px 16px",
//               background: "#ff4444",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//             }}
//           >
//             Disconnect
//           </button>
//         </div>
//       ) : (
//         <button onClick={handleConnect} id="wallet-connect">
//           Connect Wallet
//         </button>
//       )}
//     </div>
//   );
// }

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
        padding: "20px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>Wallet Connection</h2>

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
          <p>Connected: {address}</p>
          <button
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
          onClick={handleConnect}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            background: isLoading ? "#9e9e9e" : "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}
