import { Resend } from "resend";

let resend: Resend | null = null;

function getResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  const client = getResend();
  if (!client) {
    console.warn("[email] RESEND_API_KEY not configured — email not sent");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const result = await client.emails.send({
      from: from ?? `iin house <noreply@iinhouse.casa>`,
      to,
      subject,
      html,
    });
    return { success: true, id: result.data?.id };
  } catch (e: any) {
    console.error("[email] Failed to send:", e.message);
    return { success: false, error: e.message };
  }
}

// ── Templates ──────────────────────────────────────────────

export function verificationEmail(link: string): string {
  return `
    <div style="font-family: 'DM Sans', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #fafafa; background: #0c0c0e;">
      <div style="font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 700; margin-bottom: 8px;">iin house</div>
      <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 32px;">Verify your email to get started.</p>
      <a href="${link}" style="display: inline-block; padding: 12px 28px; background: #f59e0b; color: #0c0c0e; border-radius: 9999px; font-weight: 600; font-size: 14px; text-decoration: none;">Verify email</a>
      <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin-top: 32px;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
    </div>
  `;
}

export function passwordResetEmail(link: string): string {
  return `
    <div style="font-family: 'DM Sans', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #fafafa; background: #0c0c0e;">
      <div style="font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 700; margin-bottom: 8px;">iin house</div>
      <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 32px;">Reset your password.</p>
      <a href="${link}" style="display: inline-block; padding: 12px 28px; background: #f59e0b; color: #0c0c0e; border-radius: 9999px; font-weight: 600; font-size: 14px; text-decoration: none;">Reset password</a>
      <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin-top: 32px;">This link expires in 1 hour. If you didn't request this, you can ignore it.</p>
    </div>
  `;
}

export function welcomeEmail(name: string): string {
  return `
    <div style="font-family: 'DM Sans', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #fafafa; background: #0c0c0e;">
      <div style="font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 700; margin-bottom: 8px;">iin house</div>
      <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 24px;">Welcome${name ? ", " + name : ""}.</p>
      <p style="color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.6;">Your account is ready. Start browsing creators or set up your creator profile.</p>
      <a href="${process.env.NEXTAUTH_URL}" style="display: inline-block; padding: 12px 28px; background: #f59e0b; color: #0c0c0e; border-radius: 9999px; font-weight: 600; font-size: 14px; text-decoration: none; margin-top: 24px;">Open iin house</a>
    </div>
  `;
}

export function verifyEmailHtml(token: string, name: string): string {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  return `
    <div style="font-family: 'DM Sans', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #fafafa; background: #0c0c0e;">
      <div style="font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 700; margin-bottom: 8px;">iin house</div>
      <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 24px;">Welcome${name ? ", " + name : ""}.</p>
      <p style="color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.6;">Verify your email to activate your account and unlock all features.</p>
      <a href="${verifyUrl}" style="display: inline-block; padding: 12px 28px; background: #f59e0b; color: #0c0c0e; border-radius: 9999px; font-weight: 600; font-size: 14px; text-decoration: none; margin-top: 24px;">Verify email</a>
      <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin-top: 24px;">This link expires in 24 hours.</p>
    </div>
  `;
}

// ── New templates ───────────────────────────────────────────

export function subscriptionConfirmedEmail(creatorName: string, tierName: string, amount: string): string {
  return `
    <div style="font-family: 'DM Sans', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #fafafa; background: #0c0c0e;">
      <div style="font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 700; margin-bottom: 8px;">iin house</div>
      <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 24px;">Subscription confirmed.</p>
      <p style="color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.6;">
        You are now subscribed to <strong style="color: #f59e0b;">${escapeHtml(creatorName)}</strong>
        on the <strong style="color: #f59e0b;">${escapeHtml(tierName)}</strong> tier.
      </p>
      <p style="color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.6; margin-top: 16px;">
        Amount charged: <strong style="color: #fafafa;">${escapeHtml(amount)}</strong>
      </p>
      <a href="${process.env.NEXTAUTH_URL}/subscriber/subscriptions" style="display: inline-block; padding: 12px 28px; background: #f59e0b; color: #0c0c0e; border-radius: 9999px; font-weight: 600; font-size: 14px; text-decoration: none; margin-top: 24px;">View subscriptions</a>
      <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin-top: 32px;">Manage your subscription anytime from your account settings.</p>
    </div>
  `;
}

export function payoutProcessedEmail(amount: string, period: string): string {
  return `
    <div style="font-family: 'DM Sans', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #fafafa; background: #0c0c0e;">
      <div style="font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 700; margin-bottom: 8px;">iin house</div>
      <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 24px;">Payout processed.</p>
      <p style="color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.6;">
        Your payout of <strong style="color: #f59e0b;">${escapeHtml(amount)}</strong>
        for the period <strong style="color: #fafafa;">${escapeHtml(period)}</strong> has been processed.
      </p>
      <a href="${process.env.NEXTAUTH_URL}/creator/payouts" style="display: inline-block; padding: 12px 28px; background: #f59e0b; color: #0c0c0e; border-radius: 9999px; font-weight: 600; font-size: 14px; text-decoration: none; margin-top: 24px;">View payouts</a>
      <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin-top: 32px;">Funds will be credited to your registered bank account within 3-5 business days.</p>
    </div>
  `;
}

export function payoutRequestedEmail(amount: string): string {
  return `
    <div style="font-family: 'DM Sans', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #fafafa; background: #0c0c0e;">
      <div style="font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 700; margin-bottom: 8px;">iin house</div>
      <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 24px;">Payout requested.</p>
      <p style="color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.6;">
        You have requested a payout of <strong style="color: #f59e0b;">${escapeHtml(amount)}</strong>.
        We will process it shortly and notify you once it is completed.
      </p>
      <a href="${process.env.NEXTAUTH_URL}/creator/payouts" style="display: inline-block; padding: 12px 28px; background: #f59e0b; color: #0c0c0e; border-radius: 9999px; font-weight: 600; font-size: 14px; text-decoration: none; margin-top: 24px;">View payouts</a>
      <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin-top: 32px;">If you did not request this payout, please contact support immediately.</p>
    </div>
  `;
}

export function contentFlaggedEmail(contentType: string, reason: string): string {
  return `
    <div style="font-family: 'DM Sans', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #fafafa; background: #0c0c0e;">
      <div style="font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 700; margin-bottom: 8px; color: #ef4444;">iin house</div>
      <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 24px;">Your content has been flagged.</p>
      <p style="color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.6;">
        Your <strong style="color: #fafafa;">${escapeHtml(contentType)}</strong> has been flagged for review.
      </p>
      <p style="color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.6; margin-top: 16px;">
        Reason: <em style="color: rgba(255,255,255,0.7);">${escapeHtml(reason)}</em>
      </p>
      <a href="${process.env.NEXTAUTH_URL}/creator/content" style="display: inline-block; padding: 12px 28px; background: #f59e0b; color: #0c0c0e; border-radius: 9999px; font-weight: 600; font-size: 14px; text-decoration: none; margin-top: 24px;">Review content</a>
      <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin-top: 32px;">Our team will review the flagged content and take appropriate action. Please ensure all content complies with our community guidelines.</p>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
