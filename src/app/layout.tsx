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
        <header className="flex items-center justify-end gap-3 px-6 py-4">
          <AuthHeader />
        </header>
        {children}
      </body>
    </html>
  );
}
