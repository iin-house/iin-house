"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg)" }}>
      <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>Something went wrong!</h2>
      <p style={{ fontSize: "14px", color: "var(--text-3)", marginBottom: "16px" }}>{error.message}</p>
      <button
        onClick={() => reset()}
        className="btn btn-primary"
      >
        Try again
      </button>
    </div>
  );
}
