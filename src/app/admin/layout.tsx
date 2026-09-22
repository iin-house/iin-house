import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/login?error=admin-only");
  }
  return <>{children}</>;
}
