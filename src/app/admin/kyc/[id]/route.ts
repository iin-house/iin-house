import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { logAudit } from "@/lib/audit";

const reviewSchema = z.object({
  action: z.enum(["approve", "reject"]),
  notes: z.string().max(500).optional(),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Accept both JSON and form-encoded bodies (form is used by the admin page)
    const contentType = req.headers.get("content-type") || "";
    let body: any;
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const form = await req.formData();
      body = { action: form.get("action"), notes: form.get("notes") ?? undefined };
    }

    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      // For form posts, redirect back to the page on error
      if (!contentType.includes("application/json")) {
        return NextResponse.redirect(new URL("/admin/kyc", req.url));
      }
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { action, notes } = parsed.data;
    const kycId = params.id;

    const kyc = await prisma.kycDocument.findUnique({ where: { id: kycId } });
    if (!kyc) {
      if (!contentType.includes("application/json")) {
        return NextResponse.redirect(new URL("/admin/kyc", req.url));
      }
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const reviewerId = (session.user as any).id;
    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";

    await prisma.kycDocument.update({
      where: { id: kycId },
      data: {
        status: newStatus,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        notes: notes ?? null,
      },
    });

    // Sync user KYC state
    if (action === "approve") {
      await prisma.user.update({
        where: { id: kyc.userId },
        data: {
          ageVerified: true,
          kycStatus: "VERIFIED",
        },
      });
    } else {
      // Rejected — keep kycStatus as PENDING so they can resubmit, unless there are no PENDING docs left
      const stillPending = await prisma.kycDocument.count({
        where: { userId: kyc.userId, status: "PENDING" },
      });
      if (stillPending === 0) {
        await prisma.user.update({
          where: { id: kyc.userId },
          data: { kycStatus: "REJECTED" },
        });
      }
    }

    await logAudit({
      userId: reviewerId,
      action: `kyc.${action}`,
      target: kycId,
      metadata: { userId: kyc.userId, documentType: kyc.documentType, notes },
    });

    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(new URL("/admin/kyc", req.url));
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (!req.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.redirect(new URL("/admin/kyc", req.url));
    }
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "PENDING";

  const items = await prisma.kycDocument.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, email: true, phone: true } } },
  });

  return NextResponse.json(
    items.map((k) => ({
      id: k.id,
      userId: k.userId,
      userEmail: k.user.email,
      userPhone: k.user.phone,
      documentType: k.documentType,
      documentUrl: k.documentUrl,
      status: k.status,
      notes: k.notes,
      createdAt: k.createdAt,
    }))
  );
}
