const WalletButton = ({ isConnected, address, onConnect, onDisconnect }) => {
  return (
    <div className="card">
      <h2>Wallet Connection</h2>
      {isConnected ? (
        <div className="flex-center gap-2">
          <span className="text-truncate" style={{ maxWidth: "200px" }}>
            {address}
          </span>
          <button className="btn btn-outline" onClick={onDisconnect}>
            Disconnect
          </button>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={onConnect}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletButton;
