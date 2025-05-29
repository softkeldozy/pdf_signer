import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            border: "1px solid #ff6b6b",
            borderRadius: "8px",
            background: "#fff5f5",
            margin: "20px 0",
          }}
        >
          <h3 style={{ color: "#ff6b6b" }}>Something went wrong</h3>
          <p style={{ margin: "10px 0" }}>{this.state.error.message}</p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: "8px 16px",
              background: "#ff6b6b",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
