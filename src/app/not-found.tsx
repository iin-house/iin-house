import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg)" }}>
      <h2 style={{ fontSize: "48px", fontWeight: 800, marginBottom: "4px" }}>404</h2>
      <p style={{ fontSize: "16px", color: "var(--text-3)", marginBottom: "20px" }}>This page could not be found.</p>
      <Link href="/" className="btn btn-primary">
        Go back home
      </Link>
    </div>
  );
}
