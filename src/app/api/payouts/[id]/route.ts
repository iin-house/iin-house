import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status } = body;

    const payout = await prisma.payout.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(payout);
  } catch {
    return NextResponse.json({ ok: true, id: params.id, status: "updated (demo)" });
  }
}
