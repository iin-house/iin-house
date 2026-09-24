import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = {
  OPEN: "badge-warning",
  APPROVED: "badge-success",
  REMOVED: "badge-danger",
  DISMISSED: "badge-muted",
  RESOLVED: "badge-success",
  REJECTED: "badge-muted",
};

export default async function ModerationPage() {
  const [openFlags, openDisputes, flagsRaw, disputesRaw] = await Promise.all([
    prisma.moderationFlag.count({ where: { status: "OPEN" } }),
    prisma.dispute.count({ where: { status: "OPEN" } }),
    prisma.moderationFlag.findMany({
      where: { status: "OPEN" },
      include: {
        content: {
          include: {
            creator: { include: { user: { select: { email: true } } } },
          },
        },
        flagger: { select: { email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.dispute.findMany({
      where: { status: "OPEN" },
      include: {
        user: { select: { email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AdminNav />
      <main className="container" style={{ padding: "28px 20px 60px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span className="badge badge-primary" style={{ fontSize: 11 }}>Admin</span>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>Moderation</h1>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 20 }}>
            Review user-reported content and filed disputes
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div className="card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>🚩</span>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Open Flags</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--warning)" }}>{openFlags}</div>
              </div>
            </div>
            <div className="card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>⚖️</span>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Open Disputes</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--info)" }}>{openDisputes}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Flags Section ── */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Content Flags</h2>

          {flagsRaw.length === 0 ? (
            <div className="card" style={{ padding: "32px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>No open flags to review</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "0.5px solid var(--sep)" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>ID</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Content</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Reason</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Flagged By</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>When</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                    <th style={{ textAlign: "right", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flagsRaw.map((flag) => (
                    <tr key={flag.id} style={{ borderBottom: "0.5px solid var(--sep)" }}>
                      <td style={{ padding: "12px", fontFamily: "monospace", fontSize: 11, color: "var(--text-3)" }}>
                        {flag.id.slice(0, 8)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span className="badge badge-muted">{flag.content.type}</span>
                        <span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: 6 }}>
                          by {flag.content.creator.user.email ?? "unknown"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", maxWidth: 220 }}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{flag.reason}</span>
                      </td>
                      <td style={{ padding: "12px", color: "var(--text-2)" }}>
                        {flag.flagger.email ?? "unknown"}
                      </td>
                      <td style={{ padding: "12px", color: "var(--text-3)", whiteSpace: "nowrap" }}>
                        {flag.createdAt.toLocaleDateString("en-IN")}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span className={`badge ${STATUS_BADGE[flag.status] ?? "badge-muted"}`}>{flag.status}</span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <form action={`/api/admin/flags/${flag.id}`} method="POST" style={{ display: "inline", marginRight: 4 }}>
                          <input type="hidden" name="status" value="APPROVED" />
                          <button type="submit" className="btn btn-primary btn-sm" style={{ fontSize: 11 }}>Approve</button>
                        </form>
                        <form action={`/api/admin/flags/${flag.id}`} method="POST" style={{ display: "inline", marginRight: 4 }}>
                          <input type="hidden" name="status" value="REMOVED" />
                          <button type="submit" className="btn btn-danger btn-sm" style={{ fontSize: 11 }}>Remove</button>
                        </form>
                        <form action={`/api/admin/flags/${flag.id}`} method="POST" style={{ display: "inline" }}>
                          <input type="hidden" name="status" value="DISMISSED" />
                          <button type="submit" className="btn btn-secondary btn-sm" style={{ fontSize: 11 }}>Dismiss</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── Disputes Section ── */}
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Disputes</h2>

          {disputesRaw.length === 0 ? (
            <div className="card" style={{ padding: "32px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>No open disputes to review</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "0.5px solid var(--sep)" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>ID</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Type</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Filed By</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>When</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                    <th style={{ textAlign: "right", padding: "10px 12px", color: "var(--text-3)", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {disputesRaw.map((d) => (
                    <tr key={d.id} style={{ borderBottom: "0.5px solid var(--sep)" }}>
                      <td style={{ padding: "12px", fontFamily: "monospace", fontSize: 11, color: "var(--text-3)" }}>
                        {d.id.slice(0, 8)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span className="badge badge-primary">{d.type}</span>
                      </td>
                      <td style={{ padding: "12px", maxWidth: 280 }}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{d.description}</span>
                      </td>
                      <td style={{ padding: "12px", color: "var(--text-2)" }}>
                        {d.user.email ?? "unknown"}
                      </td>
                      <td style={{ padding: "12px", color: "var(--text-3)", whiteSpace: "nowrap" }}>
                        {d.createdAt.toLocaleDateString("en-IN")}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span className={`badge ${STATUS_BADGE[d.status] ?? "badge-muted"}`}>{d.status}</span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <form action={`/api/admin/disputes/${d.id}`} method="POST" style={{ display: "inline", marginRight: 4 }}>
                          <input type="hidden" name="status" value="RESOLVED" />
                          <input type="hidden" name="resolution" value="Resolved by admin" />
                          <button type="submit" className="btn btn-primary btn-sm" style={{ fontSize: 11 }}>Resolve</button>
                        </form>
                        <form action={`/api/admin/disputes/${d.id}`} method="POST" style={{ display: "inline" }}>
                          <input type="hidden" name="status" value="REJECTED" />
                          <input type="hidden" name="resolution" value="Rejected by admin" />
                          <button type="submit" className="btn btn-secondary btn-sm" style={{ fontSize: 11, color: "var(--danger)" }}>Reject</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
