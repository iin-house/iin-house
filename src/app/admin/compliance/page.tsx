import { AdminNav } from "@/components/AdminNav";

export default function CompliancePage() {
  const checklist = [
    { id: 1, item: "Content moderation in place", done: true },
    { id: 2, item: "Grievance redressal mechanism", done: true },
    { id: 3, item: "Grievance officer contact info published", done: true },
    { id: 4, item: "Terms of Service published", done: true },
    { id: 5, item: "Privacy Policy published", done: true },
    { id: 6, item: "User verification (KYC) implemented", done: true },
    { id: 7, item: "Age gating (18+) enforced", done: true },
    { id: 8, item: "Content takedown process defined", done: true },
    { id: 9, item: "Data retention policy documented", done: false },
    { id: 10, item: "Periodic compliance audit scheduled", done: false },
    { id: 11, item: "DRM for video content configured", done: false },
    { id: 12, item: "Payment compliance (GST, TDS) documented", done: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AdminNav />
      <main className="container" style={{ padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Compliance Checklist</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>IT Rules 2021 obligations</p>

        <div style={{ display: "grid", gap: 8 }}>
          {checklist.map((item) => (
            <div key={item.id} className="card" style={{
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: item.done ? 1 : 0.7,
            }}>
              <div style={{
                width: 22, height: 22,
                borderRadius: 6,
                background: item.done ? "var(--primary)" : "var(--surface-3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "#fff",
                flexShrink: 0,
              }}>
                {item.done ? "✓" : "○"}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{item.item}</span>
              {!item.done && (
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>Mark done</button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
