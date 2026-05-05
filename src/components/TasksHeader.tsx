"use client";

import CategoryCapsTooltip from "@/components/CategoryCapsTooltip";

type Props = {
  isAuthenticated: boolean;
  onNewTask: () => void;
};

export default function TasksHeader({ isAuthenticated, onNewTask }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "stretch", background: "var(--color-surface)", marginBottom: "22px", height: "38px" }}>
      <CategoryCapsTooltip variant="regular">
        <div
          tabIndex={0}
          aria-label="Show task point caps"
          style={{
            width: "38px", minWidth: "38px", height: "38px",
            background: "var(--color-surface-2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRight: "1px solid var(--color-border-hairline)",
            cursor: "help",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
            fill="none" style={{ stroke: "var(--color-fg)" }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            <path d="M9 16l2 2 4-4" />
          </svg>
        </div>
      </CategoryCapsTooltip>

      <div style={{ position: "relative", display: "flex", alignItems: "center", paddingLeft: "14px", overflow: "hidden" }}>
        <span style={{
          fontSize: "12px", fontWeight: 700, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "var(--color-fg)",
          whiteSpace: "nowrap", position: "relative", zIndex: 1,
        }}>Tasks</span>
        <div style={{
          position: "absolute",
          left: "74px",
          top: 0,
          width: "160px",
          height: "100%",
          background: "repeating-linear-gradient(-60deg, transparent, transparent 4px, var(--color-border-hairline) 4px, var(--color-border-hairline) 8px)",
          WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)",
          maskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)",
        }} />
      </div>

      <div style={{ flex: 1 }} />

      <div className="hidden sm:flex items-center">
        <button
          onClick={() => !isAuthenticated ? undefined : onNewTask()}
          disabled={!isAuthenticated}
          title={!isAuthenticated ? "Sign in to create tasks" : undefined}
          className="pixel-btn"
          style={{
            fontSize: "11px",
            alignSelf: "center",
            margin: "0 6px",
            padding: "5px 14px",
          }}
        >
          + New
        </button>
      </div>
    </div>
  );
}
