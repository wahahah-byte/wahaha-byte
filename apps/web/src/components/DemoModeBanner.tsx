import Link from "next/link";

interface Props {
  // Wrapper margin overrides.
  className?: string;
}

// Banner shown to unauthed users; their changes live in-memory only.
export default function DemoModeBanner({ className = "mt-3 mb-3" }: Props) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 text-[10px] tracking-widest uppercase ${className}`}
      style={{
        background: "var(--color-active-highlight-bg)",
        border: "1px solid var(--color-active-highlight-border)",
        borderRadius: 3,
      }}
    >
      <span style={{ color: "var(--color-active-highlight)", opacity: 0.85 }}>
        Demo · changes are not saved
      </span>
      <Link
        href="/login"
        style={{ color: "var(--color-active-highlight)", letterSpacing: "0.18em", fontWeight: 600 }}
      >
        Sign in →
      </Link>
    </div>
  );
}
