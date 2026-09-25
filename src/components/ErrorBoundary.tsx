"use client";

import { Component, ReactNode } from "react";

interface State {
  hasError: boolean;
  error?: Error;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', padding: '40px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>😵</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button onClick={() => { this.setState({ hasError: false }); window.location.reload(); }} className="btn btn-primary btn-sm">
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
