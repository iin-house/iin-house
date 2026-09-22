import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

let _prisma: any = null;
async function getPrisma() {
  if (!_prisma) {
    try {
      const mod = await import("@/lib/db");
      _prisma = (mod as any).prisma;
    } catch {
      _prisma = null;
    }
  }
  return _prisma;
}

const DEMO_SESSIONS: Record<string, { id: string; role: "CREATOR" | "SUBSCRIBER" | "ADMIN"; email: string }> = {
  "admin:1234:CREATOR":    { id: "demo-creator",    role: "CREATOR",    email: "creator@iinhouse.com" },
  "admin:1234:SUBSCRIBER": { id: "demo-subscriber", role: "SUBSCRIBER", email: "user@iinhouse.com" },
  "admin:1234:ADMIN":      { id: "demo-admin",      role: "ADMIN",      email: "admin@iinhouse.com" },
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Account",
      credentials: {
        identifier: { label: "Email or phone", placeholder: "admin" },
        password: { label: "Password", type: "password" },
        role: { label: "Role (demo)", type: "text" },
      },
      async authorize(credentials: any) {
        if (!credentials?.identifier || !credentials?.password) return null;
        const requestedRole = (credentials.role as "CREATOR" | "SUBSCRIBER" | "ADMIN") || "SUBSCRIBER";

        if (process.env.DEMO_MODE === "true" && credentials.identifier === "admin" && credentials.password === "1234") {
          const session = DEMO_SESSIONS[`admin:1234:${requestedRole}`];
          if (session) return { id: session.id, email: session.email, role: session.role, name: session.email };
          const fallback = DEMO_SESSIONS["admin:1234:SUBSCRIBER"];
          return { id: fallback.id, email: fallback.email, role: fallback.role, name: fallback.email };
        }

        const prisma = await getPrisma();
        if (!prisma) return null;
        try {
          const user = await prisma.user.findFirst({
            where: { OR: [{ email: credentials.identifier }, { phone: credentials.identifier }] },
          });
          if (!user) return null;
          const valid = await compare(credentials.password, user.passwordHash);
          if (!valid) return null;
          return { id: user.id, email: user.email, role: user.role, name: (user.email ?? user.phone) };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) { token.id = user.id; token.role = user.role; }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = { ...session.user, id: token.id, role: token.role };
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
