"use client";

import { useEffect, useRef, useState } from "react";

type Filter = { label: string; shortLabel: string; value: string };

type Variant = "primary" | "secondary";

const VARIANT_STYLES: Record<Variant, { color: string; bg: string; border: string }> = {
  primary: {
    color: "var(--color-accent)",
    bg: "var(--color-accent-bg)",
    border: "var(--color-accent-border)",
  },
  secondary: {
    color: "var(--color-secondary-accent)",
    bg: "var(--color-secondary-accent-bg)",
    border: "var(--color-secondary-accent-border)",
  },
};

interface Props {
  filters: readonly Filter[];
  activeFilter: string;
  onChange: (value: string) => void;
  getCount?: (value: string) => number;
  badgeColor?: (value: string) => string | null;
  variant?: Variant;
}

export default function FilterMenu({ filters, activeFilter, onChange, getCount, badgeColor, variant = "primary" }: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const active = filters.find((f) => f.value === activeFilter) ?? filters[0];
  const activeCount = getCount?.(active.value);
  const activeBadge = badgeColor?.(active.value) ?? null;
  const styles = VARIANT_STYLES[variant];

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    // Defer registration so the same tap that opened doesn't immediately trigger close.
    const t = window.setTimeout(() => {
      document.addEventListener("pointerdown", onOutside);
    }, 0);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-1.5 px-3 py-2.5 min-h-[40px] text-[11px] tracking-wider uppercase cursor-pointer active:opacity-80 transition-opacity"
        style={{
          color: styles.color,
          background: styles.bg,
          border: `1px solid ${styles.border}`,
          borderRadius: "3px",
          fontWeight: 600,
          zIndex: 16,
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span>{active.shortLabel}</span>
        {activeCount !== undefined && (
          <span style={{ color: "var(--color-fg-muted)", fontWeight: 500 }}>
            {activeCount}
          </span>
        )}
        {activeBadge && (
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: activeBadge }} />
        )}
        <svg
          width="8" height="6" viewBox="0 0 8 6" fill="none"
          style={{ marginLeft: 2, opacity: 0.7, transition: "transform 0.15s ease-out", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="0.5,1 4,4.5 7.5,1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div
            className="absolute filter-menu-anim"
            role="menu"
            aria-label="Filter tasks"
            style={{
              top: "calc(100% + 4px)",
              left: 0,
              zIndex: 20,
              minWidth: 200,
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 4,
              boxShadow: "var(--shadow-popover)",
              overflow: "hidden",
            }}
          >
            {filters.map((f) => {
              const isActive = f.value === activeFilter;
              const count = getCount?.(f.value);
              const rowBadge = badgeColor?.(f.value) ?? null;
              return (
                <button
                  key={f.value}
                  onClick={() => { onChange(f.value); setOpen(false); }}
                  role="menuitemradio"
                  aria-checked={isActive}
                  className={[
                    "w-full flex items-center justify-between gap-3 px-3 py-3 min-h-[44px] cursor-pointer text-left transition-colors",
                    isActive ? "" : "hover:bg-[var(--color-overlay-hover)] active:bg-[var(--color-overlay-hover)]",
                  ].filter(Boolean).join(" ")}
                  style={{
                    background: isActive ? styles.bg : undefined,
                    color: isActive ? styles.color : "var(--color-fg)",
                    border: "none",
                    borderLeft: isActive ? `2px solid ${styles.color}` : "2px solid transparent",
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[11px] tracking-widest uppercase font-semibold">{f.label}</span>
                    {rowBadge && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: rowBadge }} />
                    )}
                  </span>
                  <span className="flex items-center gap-2">
                    {count !== undefined && (
                      <span className="text-[11px] tabular-nums" style={{ color: isActive ? styles.color : "var(--color-fg-muted)" }}>
                        {count}
                      </span>
                    )}
                    {isActive && (
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <polyline points="2,7 5.5,10.5 12,4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
