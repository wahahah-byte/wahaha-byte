import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import HeaderNav from "@/components/HeaderNav";
import MobileEdgeDrawer from "@/components/MobileEdgeDrawer";
import { PointsProvider } from "@/context/PointsContext";
import { ToastProvider, ToastBanner } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const themeInitScript = `
(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t='dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
        <PointsProvider>
        <ToastProvider>
        <MobileEdgeDrawer>
        <header
          className="flex items-center justify-between px-6"
          style={{
            background: "var(--color-header)",
            borderTop: "2px solid var(--color-active-highlight)",
            borderBottom: "1px solid var(--color-border-soft)",
            boxShadow: "var(--shadow-header)",
            position: "sticky",
            top: 0,
            zIndex: 30,
            height: "50px",
          }}
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--color-success)" }} />
              <span style={{ color: "var(--color-fg-muted)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Wahaha Byte
              </span>
            </div>
            <div className="hide-on-desktop flex items-center">
              <HeaderNav />
            </div>
          </div>

        </header>
        <ToastBanner />
        {children}
        </MobileEdgeDrawer>
        </ToastProvider>
        </PointsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
