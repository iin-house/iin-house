import { NextRequest, NextResponse } from "next/server";
import { signMediaUrl } from "@/lib/watermark";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  const signed = signMediaUrl(key, session.user.id);
  return NextResponse.redirect(new URL(signed, req.url));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { action, contentType } = body;
  if (!contentType || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const key = `uploads/${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${contentType.split("/")[1] ?? "bin"}`;
  return NextResponse.json({ key, uploadUrl: key /* placeholder for real signed URL */ });
}
