import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  // Seed admin
  const adminPw = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@iinhouse.com" },
    update: {},
    create: { email: "admin@iinhouse.com", passwordHash: adminPw, role: "ADMIN", kycStatus: "VERIFIED", ageVerified: true },
  });

  // Seed demo creator
  const creatorPw = await bcrypt.hash("creator123", 12);
  const creator = await prisma.user.upsert({
    where: { email: "creator@iinhouse.com" },
    update: {},
    create: { email: "creator@iinhouse.com", passwordHash: creatorPw, role: "CREATOR", kycStatus: "VERIFIED", ageVerified: true },
  });

  await prisma.creatorProfile.upsert({
    where: { userId: creator.id },
    update: {},
    create: {
      userId: creator.id,
      displayName: "Demo Creator",
      bio: "Welcome to my exclusive content! Subscribe for photos, videos, and live chats.",
      verificationStatus: "VERIFIED",
      revenueSplitPct: 80,
    },
  });

  // Seed subscription tiers
  const profile = await prisma.creatorProfile.findUnique({ where: { userId: creator.id } });
  if (profile) {
    await prisma.subscriptionTier.createMany({
      data: [
        { creatorId: profile.id, name: "Starter", price: 149, currency: "INR", perksDescription: "Early access to posts", active: true },
        { creatorId: profile.id, name: "VIP", price: 299, currency: "INR", perksDescription: "All posts + DMs + exclusive content", active: true },
      ],
      skipDuplicates: true,
    });
  }

  // Seed demo subscriber
  const subPw = await bcrypt.hash("sub123", 12);
  await prisma.user.upsert({
    where: { email: "sub@iinhouse.com" },
    update: {},
    create: { email: "sub@iinhouse.com", passwordHash: subPw, role: "SUBSCRIBER", kycStatus: "VERIFIED", ageVerified: true },
  });

  console.log("Seeded: admin@iinhouse.com / creator@iinhouse.com / sub@iinhouse.com");
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
