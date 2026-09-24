import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "iin house — creator subscriptions",
  description: "Premium creator subscription platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-dark-950 text-dark-50`} style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Providers>
          {children}
          <Toaster position="top-right" toastOptions={{ style: { background: "#16191e", color: "#f8f9fa", border: "1px solid #2a2f37" } }} />
        </Providers>
      </body>
    </html>
  );
}
