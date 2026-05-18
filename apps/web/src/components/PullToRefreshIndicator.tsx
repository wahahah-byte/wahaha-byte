"use client";

type Phase = "idle" | "pulling" | "ready" | "refreshing";

type Props = {
  pullY: number;
  phase: Phase;
  triggerDistance: number;
};

export default function PullToRefreshIndicator({ pullY, phase, triggerDistance }: Props) {
  if (pullY <= 0 && phase === "idle") return null;
  const progress = Math.min(pullY / triggerDistance, 1);
  const isRefreshing = phase === "refreshing";
  const isReady = phase === "ready";

  return (
    <div
      aria-hidden
      style={{
        height: pullY,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: isRefreshing || phase === "idle" ? "height 0.18s cubic-bezier(0.2, 0, 0, 1)" : "none",
        color: isReady || isRefreshing ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
        opacity: Math.max(0.35, progress),
      }}
    >
      {isRefreshing ? (
        <div
          className="w-4 h-4 border-2 rounded-full animate-spin"
          style={{
            borderColor: "var(--color-border)",
            borderTopColor: "var(--color-active-highlight)",
          }}
        />
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: `rotate(${isReady ? 180 : 0}deg)`,
            transition: "transform 0.18s cubic-bezier(0.2, 0, 0, 1)",
          }}
        >
          <line x1="8" y1="2" x2="8" y2="13" />
          <polyline points="3,8 8,13 13,8" />
        </svg>
      )}
    </div>
  );
}
