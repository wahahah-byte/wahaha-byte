"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer shrink-0 transition-colors"
      style={{
        background: "var(--color-button-bg)",
        border: "1px solid var(--color-button-border)",
        color: "var(--color-button-fg)",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Both icons render; CSS picks one via the [data-theme] attribute that
          the inline themeInitScript sets on <html> before React hydrates. This
          avoids the SSR/CSR mismatch that occurs when localStorage has "light"
          but the server defaults to "dark". */}
      <svg
        className="theme-toggle-icon-sun"
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        className="theme-toggle-icon-moon"
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
