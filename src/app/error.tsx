"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div className="card" style={{ padding: "40px", maxWidth: 420, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Something went wrong</h2>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 20 }}>{error.message}</p>
        <button onClick={reset} className="btn btn-primary">Try again</button>
      </div>
    </div>
  );
}
