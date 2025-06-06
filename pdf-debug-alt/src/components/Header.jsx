const Header = () => {
  return (
    <header className="flex-center" style={{ marginBottom: "3rem" }}>
      <div style={{ textAlign: "center" }}>
        <h1 className="intro">
          <span className="word1">PDF</span>
          <span className="word2">Signing</span>
          <span className="word3">DApp</span>
        </h1>
        <p className="text-gray italic-message">
          Securely sign documents on the blockchain using <span>Sign</span> SDK
        </p>
      </div>
    </header>
  );
};

export default Header;
