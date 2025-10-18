// src/ErrorBoundary.js
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("App crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <h1 style={{ marginTop: 0, color: "#9b1c18" }}>Something went wrong.</h1>
          <p><strong>{String(this.state.error?.message || this.state.error)}</strong></p>
          <p>Try refreshing, or use the navigation to go elsewhere.</p>
        </div>
      );
    }
    return this.props.children;
  }
}