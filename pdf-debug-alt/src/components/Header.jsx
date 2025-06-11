import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
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
