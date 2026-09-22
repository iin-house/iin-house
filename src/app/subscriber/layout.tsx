import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { redirect } from "next/navigation";

export default async function SubscriberLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "SUBSCRIBER") {
    redirect("/login?error=subscriber-only");
  }
  return <>{children}</>;
}
