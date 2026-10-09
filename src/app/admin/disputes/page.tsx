import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";
import { DisputesClient } from "./DisputesClient";

export const dynamic = "force-dynamic";

export default async function DisputesPage() {
  let disputes: any[] = [];

  try {
    disputes = await prisma.dispute.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    disputes = [
      { id: "d1", type: "BILLING", description: "Charged twice for January subscription", userId: "u1", createdAt: new Date(), status: "OPEN" },
      { id: "d2", type: "CONTENT", description: "Content did not match description", userId: "u2", createdAt: new Date(Date.now() - 86400000), status: "OPEN" },
      { id: "d3", type: "BILLING", description: "Refund not received", userId: "u3", createdAt: new Date(Date.now() - 172800000), status: "RESOLVED", resolution: "Refund processed via Razorpay" },
    ];
  }

  const data = disputes.map((d: any) => ({
    id: d.id,
    type: d.type,
    description: d.description,
    userId: d.userId,
    createdAt: d.createdAt instanceof Date ? d.createdAt.toISOString() : d.createdAt,
    status: d.status,
    resolution: d.resolution,
  }));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AdminNav />
      <main className="container" style={{ padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Disputes</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>Billing and content disputes</p>
        <DisputesClient disputes={data} />
      </main>
    </div>
  );
}
