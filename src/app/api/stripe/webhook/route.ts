import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyWebhook } from "@/lib/payments";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const event = await verifyWebhook(body, signature);
  if (!event) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const creatorId = session.metadata?.creatorId;
        const tierId = session.metadata?.tierId;
        const contentId = session.metadata?.contentId;
        const mode = session.mode;

        if (!userId) break;

        if (mode === "subscription" && creatorId && tierId) {
          await prisma.subscription.create({
            data: {
              subscriberId: userId,
              creatorId,
              tierId,
              status: "ACTIVE",
              renewedAt: new Date(),
            },
          });
        } else if (mode === "payment" && contentId) {
          const post = await prisma.contentPost.findUnique({ where: { id: contentId } });
          if (post) {
            await prisma.pPVPurchase.create({
              data: { subscriberId: userId, contentId, amount: post.ppvPrice ?? 0 },
            });
          }
        }
        break;
      }
      case "invoice.payment_succeeded": {
        // Auto-renew subscription
        const inv = event.data.object as Stripe.Invoice;
        const sub = inv.subscription;
        if (sub) {
          await prisma.subscription.updateMany({
            where: { status: "ACTIVE" },
            data: { renewedAt: new Date() },
          });
        }
        break;
      }
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const sub = inv.subscription;
        if (sub) {
          await prisma.subscription.updateMany({
            where: { status: "ACTIVE" },
            data: { status: "EXPIRED" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Webhook processing failed" }, { status: 500 });
  }
}
