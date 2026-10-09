import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";
import { KYCClient } from "./KYCClient";

export const dynamic = "force-dynamic";

const docTypeLabels: Record<string, string> = {
  passport: "Passport",
  drivers_license: "Driver's License",
  national_id: "National ID Card",
};

export default async function KYCPage() {
  let pending: any[] = [];
  let reviewed: any[] = [];

  try {
    [pending, reviewed] = await Promise.all([
      prisma.kycDocument.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, phone: true, role: true } } },
      }),
      prisma.kycDocument.findMany({
        where: { status: { not: "PENDING" } },
        orderBy: { reviewedAt: "desc" },
        take: 20,
        include: { user: { select: { id: true, email: true, phone: true, role: true } } },
      }),
    ]);
  } catch {
    // DB unavailable — show demo data
    pending = [
      { id: "demo-1", documentType: "passport", documentUrl: "#", createdAt: new Date(), user: { email: "priya@example.com", phone: null, id: "u1" } },
      { id: "demo-2", documentType: "national_id", documentUrl: "#", createdAt: new Date(Date.now() - 86400000), user: { email: "rohit@example.com", phone: null, id: "u2" } },
      { id: "demo-3", documentType: "drivers_license", documentUrl: "#", createdAt: new Date(Date.now() - 172800000), user: { email: null, phone: "+91 98765 43210", id: "u3" } },
    ];
    reviewed = [
      { id: "r1", documentType: "passport", status: "APPROVED", reviewedAt: new Date(Date.now() - 604800000), notes: "All good", user: { email: "anika@example.com" } },
    ];
  }

  const serialized = {
    pending: pending.map((item: any) => ({
      id: item.id,
      documentType: item.documentType,
      documentUrl: item.documentUrl,
      createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
      userLabel: item.user.email ?? item.user.phone ?? item.user.id ?? item.userId,
      docLabel: docTypeLabels[item.documentType] ?? item.documentType,
    })),
    reviewed: reviewed.map((item: any) => ({
      id: item.id,
      documentType: item.documentType,
      status: item.status,
      reviewedAt: item.reviewedAt instanceof Date ? item.reviewedAt.toISOString() : item.reviewedAt,
      notes: item.notes,
      userLabel: item.user.email ?? item.user.phone ?? item.user.id ?? item.userId,
      docLabel: docTypeLabels[item.documentType] ?? item.documentType,
    })),
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AdminNav />
      <main className="container" style={{ padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>KYC Queue</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>Identity verification submissions</p>
        <KYCClient pending={serialized.pending} reviewed={serialized.reviewed} />
      </main>
    </div>
  );
}
