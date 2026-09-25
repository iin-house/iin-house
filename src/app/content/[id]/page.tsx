"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { CreatorNav } from "@/components/CreatorNav";
import { SubscriberNav } from "@/components/SubscriberNav";
import toast from "react-hot-toast";
import { Lock, CheckCircle2, Heart, Share2, Flag, ChevronLeft, Play, Pause, Image as ImageIcon } from "lucide-react";

type PostDetail = {
  id: string;
  type: string;
  caption: string;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  watermarkedUrl: string | null;
  isPPV: boolean;
  ppvPrice: number | null;
  visibility: string;
  views: number;
  publishedAt: string;
  creator: { id: string; displayName: string; profileImageUrl: string | null; userId: string; tiers?: { id: string; name: string; price: number; currency: string }[] };
  canView: boolean;
  isOwner: boolean;
  isSubscriber: boolean;
};

export default function ContentDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    fetch(`/api/content/${postId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setPost(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status, postId]);

  const handleUnlock = async () => {
    if (!post?.ppvPrice) return;
    setUnlocking(true);
    try {
      // Create Razorpay order for PPV
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "content", contentId: post.id }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order");

      // Open Razorpay checkout
      const options = {
        key: (window as any).process?.env?.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: post.creator.displayName,
        description: "Unlock premium content",
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              type: "content",
              contentId: post.id,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            toast.success("Content unlocked!");
            setPost(p => p ? { ...p, canView: true } : null);
          } else {
            toast.error(verifyData.error || "Payment verification failed");
          }
        },
        prefill: { name: (session?.user as any)?.name, email: (session?.user as any)?.email },
        theme: { color: "#ec4899" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e: any) {
      toast.error(e.message || "Failed to unlock");
    } finally {
      setUnlocking(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    setReporting(true);
    try {
      const res = await fetch("/api/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: "post", contentId: postId, reason: reportReason }),
      });
      if (!res.ok) throw new Error("Failed to report");
      toast.success("Report submitted. We'll review it shortly.");
      setShowReport(false);
      setReportReason("");
    } catch (e: any) {
      toast.error(e.message || "Failed to report");
    } finally {
      setReporting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (status === "loading" || loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session || !post) return null;

  const isLocked = post.isPPV && !post.canView;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {(session.user as any).role === "CREATOR" ? <CreatorNav /> : <SubscriberNav />}

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 20px' }}>
        {/* Back button */}
        <Link href="/content-feed" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-3)', marginBottom: '16px', textDecoration: 'none' }}>
          <ChevronLeft size={16} /> Back to feed
        </Link>

        {/* Creator info bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Link href={`/profile/${post.creator.userId}`}>
            <div className="avatar avatar-md" style={{
              background: post.creator.profileImageUrl ? `url(${post.creator.profileImageUrl}) center/cover` : 'linear-gradient(135deg, #9d174d, #be185d)',
              width: 44, height: 44,
            }}>
              {!post.creator.profileImageUrl && post.creator.displayName[0]?.toUpperCase()}
            </div>
          </Link>
          <div style={{ flex: 1 }}>
            <Link href={`/profile/${post.creator.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{post.creator.displayName}</div>
            </Link>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', display: 'flex', gap: '12px', marginTop: '2px' }}>
              <span>{new Date(post.publishedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
              <span>{post.views.toLocaleString()} views</span>
              <span className="badge badge-secondary" style={{ fontSize: '10px' }}>{post.type}</span>
              {post.isPPV && <span className="badge badge-primary" style={{ fontSize: '10px' }}>₹{Number(post.ppvPrice)}</span>}
            </div>
          </div>
        </div>

        {/* Media content */}
        <div className="card" style={{ overflow: 'hidden', marginBottom: '16px' }}>
          {post.mediaUrl ? (
            <div style={{
              aspectRatio: post.type === "VIDEO" ? "16/9" : "1/1",
              background: `url(${isLocked ? post.thumbnailUrl || post.mediaUrl : post.mediaUrl}) center/cover`,
              position: 'relative',
            }}>
              {isLocked && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(20px)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '12px',
                }}>
                  <Lock size={40} style={{ color: 'var(--text)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>Premium content</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>Unlock for ₹{Number(post.ppvPrice)}</div>
                  </div>
                  <button onClick={handleUnlock} className="btn btn-primary" disabled={unlocking} style={{ marginTop: '8px' }}>
                    {unlocking ? "Processing…" : `Unlock for ₹${Number(post.ppvPrice)}`}
                  </button>
                </div>
              )}
              {post.type === "VIDEO" && !isLocked && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={28} color="#fff" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              aspectRatio: '16/9',
              background: 'var(--surface-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 48,
            }}>
              {post.type === 'VIDEO' ? '🎬' : post.type === 'AUDIO' ? '🎵' : post.type === 'PHOTO' ? '📷' : '📝'}
            </div>
          )}

          {/* Caption */}
          <div style={{ padding: '20px' }}>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-2)' }}>{post.caption}</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button onClick={() => setLiked(!liked)} className="btn btn-secondary" style={{ flex: 1 }}>
            <Heart size={16} style={{ color: liked ? 'var(--danger)' : 'inherit', fill: liked ? 'var(--danger)' : 'none' }} />
            {liked ? "Liked" : "Like"}
          </button>
          <button onClick={handleShare} className="btn btn-secondary" style={{ flex: 1 }}>
            <Share2 size={16} /> Share
          </button>
          {!post.isOwner && (
            <button onClick={() => setShowReport(true)} className="btn btn-secondary" style={{ flex: 1 }}>
              <Flag size={16} /> Report
            </button>
          )}
        </div>

        {/* Subscribe CTA for non-subscribers */}
        {post.creator.tiers && post.creator.tiers.length > 0 && !post.isSubscriber && !post.isOwner && (
          <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Subscribe to {post.creator.displayName}</h3>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
              {post.creator.tiers.map((tier: any) => (
                <Link key={tier.id} href={`/profile/${post.creator.userId}`} className="card" style={{
                  padding: '16px', minWidth: '160px', textDecoration: 'none', color: 'inherit',
                  border: '1px solid var(--sep)',
                }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>{tier.name}</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>₹{Number(tier.price).toLocaleString()}<span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-3)' }}>/mo</span></div>
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '12px', fontSize: '12px' }}>Subscribe</button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Report modal */}
        {showReport && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}>
            <div className="card" style={{ padding: '24px', maxWidth: '400px', width: '100%' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Report content</h3>
              <textarea className="input" rows={3} style={{ resize: 'vertical' }} value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="Why are you reporting this content?" />
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button onClick={handleReport} className="btn btn-primary btn-sm" disabled={reporting || !reportReason.trim()}>{reporting ? "Submitting…" : "Submit report"}</button>
                <button onClick={() => { setShowReport(false); setReportReason(""); }} className="btn btn-secondary btn-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
