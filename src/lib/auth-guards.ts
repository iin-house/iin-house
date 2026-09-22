import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

/**
 * Server-side auth guard — validates NextAuth session.
 * Returns 401 if not authenticated, passes user to handler.
 */
export async function withAuth<T>(
  handler: (req: NextRequest, user: { id: string; role: string }) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, {
      id: (session.user as any).id,
      role: (session.user as any).role,
    });
  };
}

export function withRole(roles: string[]) {
  return (
    handler: (req: NextRequest, user: { id: string; role: string }) => Promise<NextResponse>
  ) => {
    return async (req: NextRequest) => {
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const userRole = (session.user as any).role;
      if (!userRole || !roles.includes(userRole)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return handler(req, { id: (session.user as any).id, role: userRole });
    };
  };
}
