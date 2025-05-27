import { useState } from "react";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

const WalletButton = ({ isConnected, address, onConnect, onDisconnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);

      if (!window.ethereum) {
        throw new Error("Please install MetaMask or another Ethereum wallet");
      }

      const walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum),
      });

      const [address] = await walletClient.requestAddresses();
      onConnect(address);
    } catch (error) {
      console.error("Connection error:", error);
      alert(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="card">
      <h2>Wallet Connection</h2>
      {isConnected ? (
        <div className="flex-center gap-2">
          <span className="text-truncate" style={{ maxWidth: "200px" }}>
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </span>
          <button className="btn btn-outline" onClick={onDisconnect}>
            Disconnect
          </button>
        </div>
      ) : (
        <button
          className="btn btn-primary"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
};

export default WalletButton;
