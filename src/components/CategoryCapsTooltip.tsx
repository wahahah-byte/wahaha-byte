"use client";

import { useState, type ReactNode } from "react";
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

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 40,
            background: "#1c1d21",
            border: "1px solid #3a3b3f",
            borderRadius: 4,
            boxShadow: "0 12px 28px rgba(0,0,0,0.55)",
            padding: "10px 12px",
            minWidth: 220,
            pointerEvents: "none",
          }}
        >
          {variant === "regular" ? <RegularCapsContent /> : <RecurringCapsContent />}
        </div>
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
        color: "rgba(255,255,255,0.4)",
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
      <span style={{ color: leftColor ?? "rgba(255,255,255,0.7)" }}>{left}</span>
      <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{right}</span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }} />;
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
      <SectionHeader>Recurring caps</SectionHeader>
      <Row left="Per check-in" right="1–5 pts" />
      <Divider />
      <Row left="Per category / day" right={`${PER_CATEGORY_RECURRING_DAILY_CAP} pts`} />
      <Row left="Total recurring / day" right={`${RECURRING_CAP} pts`} />
    </>
  );
}
