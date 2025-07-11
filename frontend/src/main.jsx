import React from "react";
import ReactDOM from "react-dom/client";
import App1 from "./App1";
import "./styles/index.css";
import { Buffer } from "buffer";

if (!window.Buffer) {
  window.Buffer = Buffer;
}

// Option 1: Using the installed package (after running npm install)
// import { ErrorBoundary } from 'react-error-boundary'

// Option 2: Custom error boundary (no extra package needed)
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
          }}
        >
          <h2>Something went wrong</h2>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              marginTop: "1rem",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App1 />
    </ErrorBoundary>
  </React.StrictMode>
);
