import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { verifyRazorpayWebhook } from "@/lib/razorpay";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Razorpay webhook handler
 *
 * Events we care about:
 *  - payment.captured: one-time payment captured (PPV, tips)
 *  - subscription.activated: new subscription started
 *  - subscription.charged: recurring billing succeeded
 *  - subscription.cancelled: subscription cancelled by user/system
 *  - payment.failed: payment failure (notify user)
 *  - refund.created: refund issued
 */
export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-razorpay-signature");
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  const body = await req.text();

  // Verify Razorpay webhook signature (HMAC-SHA256 of body with webhook secret)
  const valid = await verifyRazorpayWebhook(body, signature, webhookSecret);
  if (!valid) {
    console.error("[razorpay webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.event;
  const payload = event.payload || {};

  try {
    switch (eventType) {
      case "payment.captured": {
        const payment = payload.payment?.entity;
        if (!payment) break;

        const notes = payment.notes || {};
        const userId = notes.userId;
        const type = notes.type;

        if (type === "subscription" && notes.creatorId && notes.tierId) {
          const existing = await prisma.subscription.findFirst({
            where: { subscriberId: userId, creatorId: notes.creatorId, status: "ACTIVE" },
          });
          if (existing) {
            await prisma.subscription.update({
              where: { id: existing.id },
              data: { renewedAt: new Date() },
            });
          } else {
            await prisma.subscription.create({
              data: {
                subscriberId: userId,
                creatorId: notes.creatorId,
                tierId: notes.tierId,
                status: "ACTIVE",
                startedAt: new Date(),
                renewedAt: new Date(),
              },
            });
          }
        } else if (type === "content" && notes.contentId) {
          const post = await prisma.contentPost.findUnique({ where: { id: notes.contentId } });
          if (post && userId) {
            await prisma.pPVPurchase.upsert({
              where: { subscriberId_contentId: { subscriberId: userId, contentId: notes.contentId } },
              create: { subscriberId: userId, contentId: notes.contentId, amount: post.ppvPrice ?? 0 },
              update: {},
            });
          }
        }

        await logAudit({
          userId: userId || "anonymous",
          action: "PAYMENT_CAPTURED",
          target: payment.id,
          metadata: { amount: payment.amount / 100, type, notes },
        });
        break;
      }

      case "subscription.activated":
      case "subscription.charged": {
        const subscription = payload.subscription?.entity;
        if (!subscription?.notes?.creatorId || !subscription?.notes?.tierId) break;

        const existing = await prisma.subscription.findFirst({
          where: {
            subscriberId: subscription.notes.userId,
            creatorId: subscription.notes.creatorId,
            status: "ACTIVE",
          },
        });

        if (existing) {
          await prisma.subscription.update({
            where: { id: existing.id },
            data: { renewedAt: new Date(), status: "ACTIVE" },
          });
        } else {
          await prisma.subscription.create({
            data: {
              subscriberId: subscription.notes.userId,
              creatorId: subscription.notes.creatorId,
              tierId: subscription.notes.tierId,
              status: "ACTIVE",
              startedAt: new Date(),
              renewedAt: new Date(),
            },
          });
        }

        await logAudit({
          userId: subscription.notes.userId,
          action: eventType === "subscription.activated" ? "SUBSCRIPTION_ACTIVATED" : "SUBSCRIPTION_RENEWED",
          target: subscription.id,
        });
        break;
      }

      case "subscription.cancelled": {
        const subscription = payload.subscription?.entity;
        if (!subscription?.notes?.userId || !subscription?.notes?.creatorId) break;

        await prisma.subscription.updateMany({
          where: {
            subscriberId: subscription.notes.userId,
            creatorId: subscription.notes.creatorId,
            status: "ACTIVE",
          },
          data: { status: "CANCELLED", cancelledAt: new Date() },
        });

        await logAudit({
          userId: subscription.notes.userId,
          action: "SUBSCRIPTION_CANCELLED",
          target: subscription.id,
        });
        break;
      }

      case "payment.failed": {
        const payment = payload.payment?.entity;
        if (!payment?.notes?.userId) break;

        await logAudit({
          userId: payment.notes.userId,
          action: "PAYMENT_FAILED",
          target: payment.id,
          metadata: { reason: payment.error_description, notes: payment.notes },
        });

        if (payment.notes.type === "subscription") {
          await prisma.subscription.updateMany({
            where: {
              subscriberId: payment.notes.userId,
              creatorId: payment.notes.creatorId,
              status: "ACTIVE",
            },
            data: { status: "PAST_DUE" },
          });
        }
        break;
      }

      case "refund.created": {
        const refund = payload.refund?.entity;
        if (!refund?.payment_id) break;

        const purchase = await prisma.pPVPurchase.findFirst({
          where: { paymentId: refund.payment_id },
          include: { content: true },
        });

        if (purchase) {
          await prisma.pPVPurchase.update({
            where: { id: purchase.id },
            data: { refunded: true, refundedAt: new Date() },
          });

          await logAudit({
            userId: purchase.subscriberId,
            action: "REFUND_ISSUED",
            target: purchase.id,
            metadata: { refundId: refund.id, amount: refund.amount / 100 },
          });
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("[razorpay webhook] error:", e);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
