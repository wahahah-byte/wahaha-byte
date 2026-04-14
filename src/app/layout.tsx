import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthHeader from "@/components/AuthHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wahaha Byte",
  description: "What are you doing?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header
          className="flex items-center justify-between px-6 py-3"
          style={{
            background: "#35363b",
            borderTop: "2px solid #5bb8e0",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
          }}
        >
          {/* Left: MGSV-style HUD strip */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#4ade80" }} />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                System Active
              </span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Wahaha Byte
            </span>
          </div>

          {/* Right: avatar */}
          <AuthHeader />
        </header>
        {children}
      </body>
    </html>
  );
}
