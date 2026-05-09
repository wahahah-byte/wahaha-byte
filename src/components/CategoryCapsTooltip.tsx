"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  CATEGORIES,
  CATEGORY_COLOR,
  PER_TASK_VALUE_CAP,
  PER_CATEGORY_REGULAR_DAILY_CAP,
  PER_CATEGORY_RECURRING_DAILY_CAP,
  REGULAR_CAP,
  RECURRING_CAP,
} from "@/lib/constants";

type Variant = "regular" | "recurring";

interface Props {
  variant: Variant;
  children: ReactNode;
}

export default function CategoryCapsTooltip({ variant, children }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  // Portal-mount the tooltip to escape any overflow:hidden ancestor (e.g. the
  // desktop main column). Position it below + right-aligned to the trigger.
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
  }, [open]);

  return (
    <div
      ref={triggerRef}
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && mounted && pos && createPortal(
        <div
          role="tooltip"
          style={{
            position: "fixed",
            top: pos.top,
            right: pos.right,
            zIndex: 60,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 4,
            boxShadow: "var(--shadow-popover)",
            padding: "10px 12px",
            minWidth: 220,
            pointerEvents: "none",
          }}
        >
          {variant === "regular" ? <RegularCapsContent /> : <RecurringCapsContent />}
        </div>,
        document.body
      )}
    </div>
  );
}

function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--color-fg-subtle)",
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function Row({ left, right, leftColor }: { left: string; right: string; leftColor?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "2px 0",
        fontSize: 10,
      }}
    >
      <span style={{ color: leftColor ?? "var(--color-fg-muted)" }}>{left}</span>
      <span style={{ color: "var(--color-fg)", fontWeight: 600 }}>{right}</span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--color-border-hairline)", margin: "8px 0" }} />;
}

function RegularCapsContent() {
  return (
    <>
      <SectionHeader>Per-task max</SectionHeader>
      {CATEGORIES.map((c) => (
        <Row key={c} left={c} leftColor={CATEGORY_COLOR[c]} right={`${PER_TASK_VALUE_CAP[c]} pts`} />
      ))}
      <Divider />
      <Row left="Per category / day" right={`${PER_CATEGORY_REGULAR_DAILY_CAP} pts`} />
      <Row left="Total / day" right={`${REGULAR_CAP} pts`} />
    </>
  );
}

function RecurringCapsContent() {
  return (
    <>
      <SectionHeader>Routine caps</SectionHeader>
      <Row left="Per check-in" right="1–5 pts" />
      <Divider />
      <Row left="Per category / day" right={`${PER_CATEGORY_RECURRING_DAILY_CAP} pts`} />
      <Row left="Total routines / day" right={`${RECURRING_CAP} pts`} />
    </>
  );
}
