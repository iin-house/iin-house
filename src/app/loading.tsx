export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div style={{ textAlign: "center" }}>
        <div className="gradient-text font-bold" style={{ fontSize: "22px", marginBottom: "8px" }}>iin house</div>
        <p style={{ fontSize: "13px", color: "var(--text-3)" }}>Loading…</p>
      </div>
    </div>
  );
}
