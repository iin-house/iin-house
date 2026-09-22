// ── Demo / Mock data for offline development ──────────────────────────────────
// All data is India-centric (₹ prices, Indian names). Imported by server
// components that fall back when Prisma is unavailable or the user is a
// demo user (ID starts with "demo-").

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isDemoUser(userId: string | undefined | null): boolean {
  return !!userId && userId.startsWith("demo-");
}

// ─── Feed ─────────────────────────────────────────────────────────────────────

export interface DemoPost {
  id: string;
  mediaUrl?: string;
  isPPV?: boolean;
  ppvPrice?: number;
  publishedAt: string;
}

export interface DemoUser {
  id: string;
  email: string | null;
  phone?: string;
  name?: string;
}

export interface DemoTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  perks?: string;
  active: boolean;
}

export interface DemoCreator {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  verificationStatus: string;
  user: DemoUser;
  tiers: DemoTier[];
  posts: DemoPost[];
}

const DEMO_CREATORS: DemoCreator[] = [
  {
    id: "dc-1", userId: "demo-creator-1", displayName: "Priya Sharma", bio: "Fitness coach & nutritionist. Helping you build sustainable habits.",
    verificationStatus: "VERIFIED",
    user: { id: "demo-creator-1", email: "priya@fitlife.in", phone: "+919876543210" },
    tiers: [
      { id: "t-1", name: "Starter", price: 199, currency: "INR", perks: "Weekly workout plans", active: true },
      { id: "t-2", name: "Pro", price: 499, currency: "INR", perks: "All plans + diet charts + live Q&A", active: true },
    ],
    posts: [
      { id: "p-1", mediaUrl: "", isPPV: false, ppvPrice: 0, publishedAt: "2026-01-20" },
      { id: "p-2", mediaUrl: "", isPPV: true, ppvPrice: 99, publishedAt: "2026-01-18" },
      { id: "p-3", mediaUrl: "", isPPV: false, ppvPrice: 0, publishedAt: "2026-01-15" },
    ],
  },
  {
    id: "dc-2", userId: "demo-creator-2", displayName: "Arjun Mehta", bio: "Stand-up comedian & storyteller. Laughter is the best medicine.",
    verificationStatus: "VERIFIED",
    user: { id: "demo-creator-2", email: "arjun@lol.in", phone: "+919876543211" },
    tiers: [
      { id: "t-3", name: "Fan", price: 149, currency: "INR", perks: "Early access to sets", active: true },
      { id: "t-4", name: "VIP", price: 399, currency: "INR", perks: "Backstage passes + exclusive content", active: true },
    ],
    posts: [
      { id: "p-4", mediaUrl: "", isPPV: true, ppvPrice: 149, publishedAt: "2026-01-19" },
      { id: "p-5", mediaUrl: "", isPPV: false, ppvPrice: 0, publishedAt: "2026-01-17" },
    ],
  },
  {
    id: "dc-3", userId: "demo-creator-3", displayName: "Kavya Iyer", bio: "Digital artist & illustrator. Bringing imagination to life.",
    verificationStatus: "VERIFIED",
    user: { id: "demo-creator-3", email: "kavya@artstudio.in", phone: "+919876543212" },
    tiers: [
      { id: "t-5", name: "Sketch", price: 99, currency: "INR", perks: "Weekly sketches", active: true },
      { id: "t-6", name: "Masterpiece", price: 299, currency: "INR", perks: "All art + tutorials + requests", active: true },
    ],
    posts: [
      { id: "p-6", mediaUrl: "", isPPV: false, ppvPrice: 0, publishedAt: "2026-01-21" },
      { id: "p-7", mediaUrl: "", isPPV: true, ppvPrice: 49, publishedAt: "2026-01-16" },
      { id: "p-8", mediaUrl: "", isPPV: false, ppvPrice: 0, publishedAt: "2026-01-13" },
    ],
  },
  {
    id: "dc-4", userId: "demo-creator-4", displayName: "Rahul Verma", bio: "Tech educator. Breaking down complex topics into simple Hindi & English tutorials.",
    verificationStatus: "VERIFIED",
    user: { id: "demo-creator-4", email: "rahul@techguru.in", phone: "+919876543213" },
    tiers: [
      { id: "t-7", name: "Learner", price: 249, currency: "INR", perks: "Course access", active: true },
    ],
    posts: [
      { id: "p-9", mediaUrl: "", isPPV: false, ppvPrice: 0, publishedAt: "2026-01-22" },
    ],
  },
  {
    id: "dc-5", userId: "demo-creator-5", displayName: "Anjali Kapoor", bio: "Classical dancer. Preserving Bharatnatyam through online classes.",
    verificationStatus: "VERIFIED",
    user: { id: "demo-creator-5", email: "anjali@dance.in", phone: "+919876543214" },
    tiers: [
      { id: "t-8", name: "Basic", price: 199, currency: "INR", perks: "Recorded lessons", active: true },
      { id: "t-9", name: "Guru", price: 599, currency: "INR", perks: "Live classes + feedback", active: true },
    ],
    posts: [
      { id: "p-10", mediaUrl: "", isPPV: true, ppvPrice: 79, publishedAt: "2026-01-14" },
      { id: "p-11", mediaUrl: "", isPPV: false, ppvPrice: 0, publishedAt: "2026-01-10" },
    ],
  },
  {
    id: "dc-6", userId: "demo-creator-6", displayName: "Vikram Singh", bio: "Financial coach. Smart investing for the Indian middle class.",
    verificationStatus: "VERIFIED",
    user: { id: "demo-creator-6", email: "vikram@wealthwise.in", phone: "+919876543215" },
    tiers: [
      { id: "t-10", name: "Saver", price: 299, currency: "INR", perks: "Monthly newsletter", active: true },
    ],
    posts: [
      { id: "p-12", mediaUrl: "", isPPV: false, ppvPrice: 0, publishedAt: "2026-01-23" },
      { id: "p-13", mediaUrl: "", isPPV: true, ppvPrice: 199, publishedAt: "2026-01-11" },
    ],
  },
];

export function getDemoCreators(): DemoCreator[] {
  return DEMO_CREATORS;
}

export function getDemoPosts(): DemoPost[] {
  return DEMO_CREATORS.flatMap(c => c.posts);
}

// ─── Creator Dashboard Stats ──────────────────────────────────────────────────

export interface DemoStats {
  activeSubs: number;
  ppvPurchases: number;
  totalRevenue: number;
  totalPayouts: number;
  ppvRevenue: number;
  recentSubs: Array<{ email: string | null; date: string }>;
}

export function getDemoStats(): DemoStats {
  return {
    activeSubs: 1247,
    ppvPurchases: 389,
    totalRevenue: 45200,
    totalPayouts: 31500,
    ppvRevenue: 8900,
    recentSubs: [
      { email: "rahul.m@gmail.com", date: "Jan 22" },
      { email: "priya.s@outlook.com", date: "Jan 21" },
      { email: "amit.k@rediffmail.com", date: "Jan 20" },
      { email: "sneha.p@yahoo.in", date: "Jan 19" },
      { email: "deepak.v@hotmail.com", date: "Jan 18" },
    ],
  };
}

// ─── Creator Earnings ─────────────────────────────────────────────────────────

export interface DemoEarnings {
  revenueBreakdown: { label: string; pct: number; color: string }[];
  transactions: { id: string; label: string; detail: string; amount: string; type: "in" | "out" }[];
}

export function getDemoEarnings(): DemoEarnings {
  return {
    revenueBreakdown: [
      { label: "Subscriptions", pct: 72, color: "#ec4899" },
      { label: "PPV", pct: 20, color: "#7c3aed" },
      { label: "Tips", pct: 8, color: "#059669" },
    ],
    transactions: [
      { id: "tx-1", label: "Subscriptions", detail: "Jan 2026 · 847 payments", amount: "+₹18,200", type: "in" },
      { id: "tx-2", label: "PPV Purchases", detail: "Jan 2026 · 156 purchases", amount: "+₹6,300", type: "in" },
      { id: "tx-3", label: "Platform fee", detail: "Jan 2026 · 20% cut", amount: "-₹4,900", type: "out" },
      { id: "tx-4", label: "Payout", detail: "Dec 2025 · to HDFC ****4029", amount: "-₹15,000", type: "out" },
    ],
  };
}

// ─── Creator Payouts ──────────────────────────────────────────────────────────

export interface DemoPayoutHistory {
  id: string;
  requested: string;
  amount: string | number;
  status: string;
  method: string;
}

export function getDemoPayouts(): { balance: number; history: DemoPayoutHistory[] } {
  return {
    balance: 24500,
    history: [
      { id: "po-1", requested: "Jan 18, 2026", amount: 15000, status: "COMPLETED", method: "UPI" },
      { id: "po-2", requested: "Dec 22, 2025", amount: 22000, status: "COMPLETED", method: "Bank transfer" },
      { id: "po-3", requested: "Nov 30, 2025", amount: 8500, status: "COMPLETED", method: "UPI" },
      { id: "po-4", requested: "Jan 23, 2026", amount: 12000, status: "PENDING", method: "Bank transfer" },
    ],
  };
}

// ─── Messages (shared by creator & subscriber) ────────────────────────────────

export interface DemoConversation {
  id: string;
  name: string;
  avatar: string;
  color: string;
  last: string;
  time: string;
  unread: number;
}

export interface DemoMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

export function getDemoConversations(): DemoConversation[] {
  return [
    { id: "c-1", name: "Lena Creates", avatar: "L", color: "linear-gradient(135deg, #ec4899, #db2777)", last: "Thanks for subscribing!", time: "2m", unread: 1 },
    { id: "c-2", name: "DJ Rohit", avatar: "R", color: "linear-gradient(135deg, #7c3aed, #a78bfa)", last: "Check out my latest track", time: "1h", unread: 0 },
    { id: "c-3", name: "Priya Fitness", avatar: "P", color: "linear-gradient(135deg, #059669, #34d399)", last: "Workout plan ready", time: "3h", unread: 0 },
  ];
}

export function getDemoMessages(): DemoMessage[] {
  return [
    { id: "m-1", sender: "them", text: "Hey, welcome! Thanks for subscribing.", time: "2m" },
    { id: "m-2", sender: "me", text: "Thanks! Loving the content so far ✨", time: "1m" },
  ];
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

export function getDemoAdminStats(): {
  creators: number;
  pendingKYC: number;
  openFlags: number;
  pendingPayouts: number;
} {
  return {
    creators: 342,
    pendingKYC: 5,
    openFlags: 4,
    pendingPayouts: 7,
  };
}

// ─── Admin KYC Queue ──────────────────────────────────────────────────────────

export interface DemoKYCItem {
  id: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  verificationStatus: string;
  createdAt: string;
}

export function getDemoKYCItems(): { pending: DemoKYCItem[]; reviewed: DemoKYCItem[] } {
  return {
    pending: [
      { id: "kyc-1", displayName: "Neha Gupta", email: "neha.g@gmail.com", phone: "+919876543220", verificationStatus: "PENDING", createdAt: "2026-01-22" },
      { id: "kyc-2", displayName: "Suresh Reddy", email: "suresh.r@gmail.com", phone: "+919876543221", verificationStatus: "PENDING", createdAt: "2026-01-21" },
      { id: "kyc-3", displayName: "Meera Joshi", email: "meera.j@outlook.in", phone: "+919876543222", verificationStatus: "PENDING", createdAt: "2026-01-20" },
      { id: "kyc-4", displayName: "Karthik Nair", email: "karthik.n@gmail.com", phone: "+919876543223", verificationStatus: "PENDING", createdAt: "2026-01-19" },
      { id: "kyc-5", displayName: "Divya Patil", email: "divya.p@yahoo.in", phone: "+919876543224", verificationStatus: "PENDING", createdAt: "2026-01-18" },
    ],
    reviewed: [
      { id: "kyc-6", displayName: "Ravi Krishnan", email: "ravi.k@gmail.com", phone: "+919876543225", verificationStatus: "VERIFIED", createdAt: "2026-01-15" },
      { id: "kyc-7", displayName: "Pooja Malhotra", email: "pooja.m@outlook.in", phone: "+919876543226", verificationStatus: "REJECTED", createdAt: "2026-01-12" },
    ],
  };
}

// ─── Admin Moderation Flags ───────────────────────────────────────────────────

export interface DemoFlag {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  content: { creator: { displayName: string }; user: DemoUser };
}

export function getDemoFlags(): DemoFlag[] {
  return [
    { id: "f-1", reason: "Spam content — repeated promotional links", status: "OPEN", createdAt: "2026-01-23", content: { creator: { displayName: "Arjun Mehta" }, user: { id: "demo-creator-2", email: "arjun@lol.in" } } },
    { id: "f-2", reason: "Potentially copyrighted image", status: "OPEN", createdAt: "2026-01-22", content: { creator: { displayName: "Kavya Iyer" }, user: { id: "demo-creator-3", email: "kavya@artstudio.in" } } },
    { id: "f-3", reason: "User report — inappropriate language", status: "OPEN", createdAt: "2026-01-21", content: { creator: { displayName: "Vikram Singh" }, user: { id: "demo-creator-6", email: "vikram@wealthwise.in" } } },
    { id: "f-4", reason: "Misleading health claim", status: "OPEN", createdAt: "2026-01-20", content: { creator: { displayName: "Priya Sharma" }, user: { id: "demo-creator-1", email: "priya@fitlife.in" } } },
  ];
}

// ─── Admin Contracts ──────────────────────────────────────────────────────────

export interface DemoContract {
  id: string;
  creators: { displayName: string }[];
  revenueSplitPct: number;
  termsVersion: string;
  signedAt: string | null;
  documentUrl: string;
}

export function getDemoContracts(): DemoContract[] {
  return [
    { id: "ct-1", creators: [{ displayName: "Priya Sharma" }, { displayName: "Arjun Mehta" }], revenueSplitPct: 80, termsVersion: "2.1", signedAt: "2025-12-01", documentUrl: "#" },
    { id: "ct-2", creators: [{ displayName: "Kavya Iyer" }], revenueSplitPct: 75, termsVersion: "2.0", signedAt: "2025-11-15", documentUrl: "#" },
    { id: "ct-3", creators: [{ displayName: "Rahul Verma" }, { displayName: "Anjali Kapoor" }, { displayName: "Vikram Singh" }], revenueSplitPct: 80, termsVersion: "2.1", signedAt: null, documentUrl: "#" },
  ];
}

// ─── Admin Payouts ────────────────────────────────────────────────────────────

export interface DemoPayout {
  id: string;
  creatorId: string;
  amount: number;
  status: string;
  createdAt: string;
}

export function getDemoPayoutsBalance() {
  return [
    { id: "ap-1", creatorId: "demo-creator-1", amount: 15000, status: "PENDING", createdAt: "2026-01-23" },
    { id: "ap-2", creatorId: "demo-creator-2", amount: 8500, status: "PAID", createdAt: "2026-01-20" },
    { id: "ap-3", creatorId: "demo-creator-3", amount: 12000, status: "PAID", createdAt: "2026-01-18" },
    { id: "ap-4", creatorId: "demo-creator-4", amount: 6000, status: "PENDING", createdAt: "2026-01-17" },
    { id: "ap-5", creatorId: "demo-creator-5", amount: 18000, status: "REJECTED", createdAt: "2026-01-15" },
  ];
}

// ─── Admin Analytics ──────────────────────────────────────────────────────────

export interface DemoAnalytics {
  creators: number;
  subscribers: number;
  posts: number;
  payoutsTotal: number;
  openDisputes: number;
  platformRevenue: number;
}

export function getDemoAnalytics(): DemoAnalytics {
  const totalPayouts = 487000;
  return {
    creators: 342,
    subscribers: 15800,
    posts: 6720,
    payoutsTotal: totalPayouts,
    openDisputes: 3,
    platformRevenue: Math.round(totalPayouts * 0.2),
  };
}

// ─── Admin Disputes ───────────────────────────────────────────────────────────

export interface DemoDispute {
  id: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
  resolution?: string;
}

export function getDemoDisputes(): DemoDispute[] {
  return [
    { id: "d-1", type: "billing", description: "Charged ₹999 but subscription shows inactive. UPI txn ID: 4321XXX7890", status: "OPEN", createdAt: "2026-01-23" },
    { id: "d-2", type: "content", description: "Creator removed content after I subscribed to PPV tier. Requesting partial refund.", status: "OPEN", createdAt: "2026-01-21" },
  ];
}

// ─── Subscription Tiers (for profile page) ───────────────────────────────────

export function getDemoTiers(): DemoTier[] {
  return [
    { id: "dt-1", name: "Starter", price: 149, currency: "INR", perks: "Early access to posts", active: true },
    { id: "dt-2", name: "VIP", price: 299, currency: "INR", perks: "All posts + DMs", active: true },
    { id: "dt-3", name: "Elite", price: 499, currency: "INR", perks: "Everything + monthly calls", active: false },
  ];
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

export interface DemoProfileData {
  creator: DemoCreator;
  activeCount: number;
}

export function getDemoProfile(): DemoProfileData {
  const creator = DEMO_CREATORS[0];
  return {
    creator: {
      ...creator,
      profileImageUrl: "",
    },
    activeCount: 1247,
  };
}
