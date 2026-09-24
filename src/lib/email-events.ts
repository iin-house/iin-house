import { prisma } from "@/lib/db";
import { sendEmail, subscriptionConfirmedEmail, payoutProcessedEmail, payoutRequestedEmail, contentFlaggedEmail } from "@/lib/email";

const fromAddress = `iin house <${process.env.EMAIL_FROM ?? "noreply@iinhouse.casa"}>`;

function checkEmailConfigured(): boolean {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email-events] RESEND_API_KEY not configured — email not sent");
    return false;
  }
  return true;
}

// ── Event handlers ──────────────────────────────────────────

export async function onSubscriptionCreated(
  subscriberEmail: string | undefined | null,
  creatorName: string,
  tierName: string,
  amount: string,
) {
  if (!checkEmailConfigured() || !subscriberEmail) return;

  await sendEmail({
    to: subscriberEmail,
    subject: `Subscription confirmed — ${creatorName}`,
    html: subscriptionConfirmedEmail(creatorName, tierName, amount),
    from: fromAddress,
  });
}

export async function onPayoutProcessed(creatorEmail: string | undefined | null, amount: string, period: string) {
  if (!checkEmailConfigured() || !creatorEmail) return;

  await sendEmail({
    to: creatorEmail,
    subject: `Payout processed — ${amount}`,
    html: payoutProcessedEmail(amount, period),
    from: fromAddress,
  });
}

export async function onPayoutRequested(creatorEmail: string | undefined | null, amount: string) {
  if (!checkEmailConfigured() || !creatorEmail) return;

  await sendEmail({
    to: creatorEmail,
    subject: `Payout requested — ${amount}`,
    html: payoutRequestedEmail(amount),
    from: fromAddress,
  });
}

export async function onContentFlagged(creatorEmail: string | undefined | null, contentType: string, reason: string) {
  if (!checkEmailConfigured() || !creatorEmail) return;

  await sendEmail({
    to: creatorEmail,
    subject: "Your content has been flagged",
    html: contentFlaggedEmail(contentType, reason),
    from: fromAddress,
  });
}

// ── Lookup-based helpers ───────────────────────────────────

export async function sendSubscriptionCreatedEmail(
  subscriberId: string,
  creatorId: string,
  tierId: string,
) {
  const [subscriber, creator, tier] = await Promise.all([
    prisma.user.findUnique({ where: { id: subscriberId }, select: { email: true } }),
    prisma.creatorProfile.findUnique({
      where: { id: creatorId },
      select: { displayName: true },
    }),
    prisma.subscriptionTier.findUnique({
      where: { id: tierId },
      select: { name: true, price: true },
    }),
  ]);

  if (!subscriber?.email || !creator || !tier) return;

  await onSubscriptionCreated(
    subscriber.email,
    creator.displayName,
    tier.name,
    tier.price.toString(),
  );
}

export async function sendPayoutProcessedEmail(payoutId: string) {
  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: {
      creator: {
        include: { user: { select: { email: true } } },
      },
    },
  });

  if (!payout) return;

  const period = payout.processedAt
    ? payout.processedAt.toLocaleDateString()
    : "this period";
  await onPayoutProcessed(payout.creator.user.email, payout.amount.toString(), period);
}

export async function sendPayoutRequestedEmail(payoutId: string) {
  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: {
      creator: {
        include: { user: { select: { email: true } } },
      },
    },
  });

  if (!payout) return;

  await onPayoutRequested(payout.creator.user.email, payout.amount.toString());
}
