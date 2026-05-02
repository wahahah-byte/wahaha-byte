"use client";

import CategoryCapsTooltip from "@/components/CategoryCapsTooltip";

type Props = {
  isAuthenticated: boolean;
  onNewTask: () => void;
};

export default function TasksHeader({ isAuthenticated, onNewTask }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "stretch", background: "#1e2025", marginBottom: "6px", height: "38px" }}>
      <CategoryCapsTooltip variant="regular">
        <div
          tabIndex={0}
          aria-label="Show task point caps"
          style={{
            width: "38px", minWidth: "38px", height: "38px",
            background: "#2a2d33",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            cursor: "help",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            <path d="M9 16l2 2 4-4" />
          </svg>
        </div>
      </CategoryCapsTooltip>

      <div style={{ position: "relative", display: "flex", alignItems: "center", paddingLeft: "14px", overflow: "hidden" }}>
        <span style={{
          fontSize: "12px", fontWeight: 700, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.9)",
          whiteSpace: "nowrap", position: "relative", zIndex: 1,
        }}>Tasks</span>
        <div style={{
          position: "absolute",
          left: "74px",
          top: 0,
          width: "160px",
          height: "100%",
          background: "repeating-linear-gradient(-60deg, transparent, transparent 4px, rgba(255,255,255,0.07) 4px, rgba(255,255,255,0.07) 8px)",
          WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)",
          maskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)",
        }} />
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={() => !isAuthenticated ? undefined : onNewTask()}
        title={!isAuthenticated ? "Sign in to create tasks" : undefined}
        style={{
          background: "transparent",
          color: !isAuthenticated ? "rgba(91,184,224,0.35)" : "#5bb8e0",
          fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase",
          fontWeight: 600, padding: "0 20px",
          cursor: !isAuthenticated ? "default" : "pointer",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => { if (!isAuthenticated) return; e.currentTarget.style.color = "#8dd0ea"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#5bb8e0"; }}
      >
        + New
      </button>
    </div>
  );
}
