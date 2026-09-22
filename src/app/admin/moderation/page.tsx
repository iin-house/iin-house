import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";

export default async function ModerationPage() {
  const flags = await prisma.moderationFlag.findMany({
    where: { status: "OPEN" },
    include: {
      content: { include: { creator: { include: { user: true } } } },
      flagger: { select: { email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AdminNav />
      <main className="container" style={{ padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Moderation</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>User-reported content flags</p>

        <div style={{ display: "grid", gap: 12 }}>
          {flags.map((flag) => (
            <div key={flag.id} className="card" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                    {flag.content.creator.displayName} — {flag.reason}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                    Flagged by {flag.flagger.email} on {flag.createdAt.toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <form action={`/admin/moderation/${flag.id}`} method="POST">
                    <input type="hidden" name="action" value="approve" />
                    <input type="hidden" name="notes" value="Content removed" />
                    <button type="submit" className="btn btn-primary btn-sm">Remove</button>
                  </form>
                  <form action={`/admin/moderation/${flag.id}`} method="POST">
                    <input type="hidden" name="action" value="reject" />
                    <input type="hidden" name="notes" value="Dismissed" />
                    <button type="submit" className="btn btn-secondary btn-sm">Dismiss</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
          {flags.length === 0 && <p style={{ color: "var(--text-3)" }}>No open flags</p>}
        </div>
      </main>
    </div>
  );
}
